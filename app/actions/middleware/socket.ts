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
import { ReduxStore } from '../../types/models';
import { pushMessage, replaceChatMessage } from '../matches/chat';
import { showModal } from '../navigation/modal'

import { Action, AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux'
import io from 'socket.io-client'
import config from '../../../config'

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
            encodeURIComponent(JSON.stringify(socketData)),
            (data: ReduxStore.IChat | null) => {
              if(data && activeChat) {
                dispatch(replaceChatMessage(activeChat._id, data))
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
              // tslint:disable-next-line: no-shadowed-variable
              suitorId,
            }: {
              suitorId: ReduxStore.ObjectId,
            } = action as any
            const { feed }: { feed: ReduxStore.Match[] } = getState()
            // tslint:disable-next-line: no-shadowed-variable
            let matchId = null
            for(let i = 0; i <= feed.length; i++) {
              if(feed[i].userProfiles[0]._id.toString() === suitorId.toString()) {
                matchId = feed[i]._id.toString()
                break;
              }
            }
            if(matchId) {
              socket.emit('acceptMatch', matchId, (data: {
                matchId?: ReduxStore.ObjectId
                preloadedDate?: 'sponsored' | 'event' | 'premiumMatch' | 'recommendation'
                preloadedSource?: string
                preloadedSpinner?: string

                match?: ReduxStore.Match
                // When got spinner data, send it down. client should catch it and incorporate it into match
                wheel?: any,
              }) => {
                Alert.alert('Accepted Match Response', encodeURIComponent(JSON.stringify(data)))
              })
            } else {
              throw new Error('Could not communicate with server')
            }
          } catch(e) {
            // tslint:disable-next-line: no-unused-expression
            __DEV__ && console.log(e)
            Alert.alert((e as Error).message)
          }
        }

        case DENY_MATCH: {
          const {
            // tslint:disable-next-line: no-shadowed-variable
            matchId,
          }: {
            matchId: ReduxStore.ObjectId,
          } = action as any
          return next(action)
        }

        case REQUEST_FEED: {
          const {
            searchSettings,
          }: {
            searchSettings: {
              sexualPreference: 'men' | 'women' | 'everyone'
              radius: number,
              ageRange: [number, number],
              goal: 'exclusive' | 'unsure' | 'casual' | 'serious',
              // tags: {

              // },
            },
          } = action as any
          const { feed } = getState()
          socket.emit('')
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
          socket.emit('joinchat', activeChat._id)
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
