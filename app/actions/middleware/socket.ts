import {
  POPULATE_USER,
} from '../user'

import {
  ACCEPT_MATCH,
  changeActiveChat,
  DENY_MATCH,
  POST_MESSAGE,
  PUSH_CHAT,
  REQUEST_FEED,
} from '../matches'

import { ApiResponse } from 'apisauce'
import { push } from 'connected-react-router'
import { ThunkDispatch } from 'redux-thunk'

import { authedApi } from '../../lib/api'
import { storeToken } from '../../lib/asyncStorage';

import { Alert } from 'react-native';
import { ReduxStore, SocketReturnTypes } from '../../types/models';
import { pushMessage, replaceChatMessage } from '../matches/chat';
import { showModal, pushSpinner, resetSpinner } from '../navigation/modal'

import { Action, AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux'
import io from 'socket.io-client'
import config from '../../../config'
import { populateFeed } from '../matches/feed';

// tslint:disable: no-shadowed-variable

export default function socketClientMiddleware() {
  return (storeAPI: MiddlewareAPI) => { // Put our logic within storeAPI to easily dispatch actions
    console.log('initiating Socket Middleware')
    const { dispatch, getState }: {
      dispatch: ThunkDispatch<{},{}, any> | AnyAction,
      getState: () => any,
    } = storeAPI

    const socket = io(config.socket) // initialize socket client on startup
    const state: {
      socketListening: boolean,
    } = {
      socketListening: false,
    }

    configureListeners()

    return (next: Dispatch<AnyAction>) => (action: AnyAction) => {
      switch (action.type) {

        case POPULATE_USER:
          state.socketListening = true
          socket.connect()
          return next(action)

        case PUSH_CHAT:
          const { match }: {
            match: ReduxStore.Match,
          } = action as any
          if(socket.disconnected) {
            state.socketListening = true
            socket.open()
          } else {

            socket.emit('joinchat', match._id);
          }
          return next(action)

        case POST_MESSAGE:
          // Define and get action.
          const {
            matchId,
            message,
          }: {
            matchId: ReduxStore.ObjectId
            message: {
              text?: string,
              image?: string,
              video?: string,
              location?: ReduxStore.Point,
              campaignId?: string,
            },
          } = action as any

          // prepare data
          const { activeChat, user } = getState()
          // create low-collision randomId
          const messageId = Math.min(Math.floor(Math.random() * 1000000000000), 999999999999).toString()
          const socketData: { matchId: string, message: ReduxStore.IMessage, messageId: string } = {
            matchId,
            message,
            messageId,
          }
          const newMessage = {
            message,
            user: user._id,
            _id: messageId,
            reactions: new Map(),
          }

          dispatch(pushMessage(matchId, newMessage))
          socket.emit(
            'message',
            _encode(socketData),
            (data: string | null) => {
              if(data && activeChat) {
                const sentMessage: ReduxStore.IChat = _decode(data)
                dispatch(replaceChatMessage(activeChat._id, sentMessage))
              } else {
                console.log('something went wrong submitting message')
                const errorMessage = Object.assign({}, newMessage, { error: Date.now() })
                dispatch(replaceChatMessage(matchId, errorMessage))
              }
            },
          )
          return

        case ACCEPT_MATCH: {
          try {
            const {
              suitorId,
            }: {
              suitorId: ReduxStore.ObjectId,
            } = action as any
            socket.emit(
              'acceptMatch',
              _encode(suitorId),
              (_data: SocketReturnTypes.AcceptMatch) => {
                console.log('firing acceptMatch callback!')
                if(_data) {
                  const data = _decode(_data)
                  if(data.matchId) {
                    console.log('firing match accepted')
                    dispatch(resetSpinner(user, data.match.userProfiles[0]))
                    dispatch(showModal('spinner'))
                  } else if(data.match && data.wheel) {
                    // Inject Wheel, Allow Wheel date invite to be made
                    console.log('got response for match/ wheel data')
                    const spinner: SocketReturnTypes.SpinnerInfo = {
                      user,
                      match: data.match,
                      wheel: data.wheel,
                      candidate: data.match.userProfiles[0],
                    }
                    dispatch(pushSpinner(spinner))
                  } else {
                    // tslint:disable-next-line: no-unused-expression
                    throw new Error('error accepting match')
                  }
                }
              },
            )
          } catch(e) {
            // tslint:disable-next-line: no-unused-expression
            __DEV__ && console.log(e)
            Alert.alert((e as Error).message)
            action.suitorId = null // Suitor Id May be Compromised, fallback to kicking out the first feed array
                                   // elements. slightly less reliable but safe.
          } finally {
            // tslint:disable-next-line: no-unsafe-finally
            return next(action)
          }
        }

        case DENY_MATCH: {
          try {
            const {
              suitorId,
            }: {
              suitorId: ReduxStore.ObjectId,
            } = action as any
            socket.emit('denyMatch', _encode(suitorId))
          } catch(e) {
            // tslint:disable-next-line: no-unused-expression
            __DEV__ && console.log(e)
            Alert.alert((e as Error).message)
            action.suitorId = null // Suitor Id May be Compromised, fallback to kicking out the first feed array
                                   // elements. slightly less reliable but safe.
          } finally {
            // tslint:disable-next-line: no-unsafe-finally
            return next(action)
          }
        }

        case REQUEST_FEED: {
          const {
            searchSettings,
          }: {
            searchSettings: ReduxStore.SearchSettings,
          } = action as any
          const { feed } = getState()
          socket.emit('requestFeed', _encode(searchSettings), (_data: string | null) => {
            if(_data) {
              const data = _decode(_data) as ReduxStore.Match[]
              if(data.length) {
                dispatch(populateFeed(data, searchSettings))
              }
            } else {
              Alert.alert('Could not get feed, try again later')
            }
          })
        }

        default: return next(action)
      }
    }

    function configureListeners() {

      socket.on('disconnect', () => {
        if(state.socketListening) socket.open()
      })

      socket.on('connect', () => {
        const { activeChat } = getState()
        // Connected, let's sign-up for to receive messages for this room
        // Should also send an array of new messages, client needs to handle
        // Duplication issues.

        // potentially better alternative...
        // if(activeChat && activeChat._id && typeof activeChat._id !== 'string') {
        if(activeChat._id !== '00000000') {
          socket.emit('joinchat', _encode(activeChat._id))
        }
      })

      socket.on('messageSent', (res: { matchId: string, message: ReduxStore.IChat }) => {
        pushMessage(res.matchId, res.message)
      })

      socket.on('messageRead', (res: { matchId: string, message: ReduxStore.IChat }) => {
        pushMessage(res.matchId, res.message)
      })

      // Someone Accepted user and user had already accepted
      socket.on('newMatch', (res: { match: ReduxStore.Match }) => {

      })

      // Someone accepted user, user had not accepted yet
      socket.on('newSuitor', (res: { match: ReduxStore.Match }) => {

      })
      // socket.on('')
    }
  }
}

// tslint:disable-next-line: function-name
function _decode(data: any) { return JSON.parse(decodeURIComponent(data)) }
// tslint:disable-next-line: function-name
function _encode(data: any) { return encodeURIComponent(JSON.stringify(data)) }
