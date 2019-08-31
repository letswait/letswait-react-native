import React from 'react'
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  PushNotificationIOS,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

import { colors, spacing, type } from '../../../../foundation'
import FeatherButton from '../../../components/Camera/CameraButton'

import MatchRow from '../../../components/Matches/Match'
import MatchQueue from '../../../components/Matches/QueueMatch'

import { ApiResponse } from 'apisauce';
import { authedApi } from '../../../lib/api'

import ChatInput from '../../../components/Chat/ChatInput'
import Message from '../../../components/Chat/Message'
// import CandidateMessage from '../../../components/Chat/RecievedMessage'
// import UserMessage from '../../../components/Chat/SentMessage'
import { ReduxStore } from '../../../types/models';

import config from '../../../../config'

import socket from 'socket.io-client'

const { width, height } = Dimensions.get('window')

interface IProps {
  user: any,
  shouldUpdate: boolean,
  disablePrerender?: boolean
  match?: ReduxStore.Match,
  pushChat: (matchId: string, message: ReduxStore.IChat) => void
}
interface IState {
  prerendered: boolean
}
export default class MatchesComponent extends React.Component<IProps, IState> {
  private socket: any
  public state: IState = {
    prerendered: false,
  }
  constructor(props: IProps) {
    super(props)
    this.socket = socket.connect(config.socket)
    this.socket.on('connect', () => {
      // Connected, let's sign-up for to receive messages for this room
      // Should also send an array of new messages, client needs to handle
      // Duplication issues.
      if(this.props.match && this.props.match._id !== '00000000') {
        this.socket.emit('joinchat', this.props.match._id.toString());
      }
    });
    this.socket.on('disconnect', () => {
      this.socket.open();
    });
    this.socket.on('messageSent', (res: { matchId: string, chat: ReduxStore.IChat}) => {
      this.props.pushChat(res.matchId, res.chat)
    })
  }
  // public shouldComponentUpdate() {
    // if(!this.state.prerendered && !this.props.disablePrerender) {
    //   this.setState({ prerendered: true })
    //   return true
    // }
    // return !!this.props.shouldUpdate
  // }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(this.props.match && prevProps.match && prevProps.match._id.toString() !== this.props.match._id.toString()) {
      // New Chat, Switch Rooms
      if(this.socket.disconnected) {
        // When its disconnected, it will automatically join the right room when the socket opens again.
        this.socket.open()
      } else {
        // Server checks for match, checks for both parties' approval, and leaves all other rooms before joining.
        this.socket.emit('joinchat', this.props.match._id.toString());
      }
    }
  }
  public sendMessage(message: string) {
    // Alert.alert('Sending/ Message!')
    const newMessage = {
      text: message,
    }
    const socketData: { matchId: string, message: ReduxStore.IMessage } = {
      matchId: this.props.match!._id.toString(),
      message: newMessage,
    }
    this.socket.emit(
      'message',
      socketData,
      (data: ReduxStore.IChat | null) => {
        if(data && this.props.match) {
          this.props.pushChat(this.props.match._id.toString(), data)
        } else {
          console.log('something went wrong submitting message')
        }
      },
    )
  }
  public scrollView: any = null
  public render() {
    return (
      <KeyboardAvoidingView style={style.matchWrapper} behavior="padding">
        <View style={{ flex: 1 }}/>
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical
          style={style.matchScroll}
          ref={c => this.scrollView = c}
          onContentSizeChange={() => {
            if(this.scrollView) {
              this.scrollView.scrollToEnd()
            }
          }}
          contentContainerStyle={{ paddingBottom: 16, paddingTop: 80 }}
        >
          {this.props.match && this.props.match.chat.map((msg: any, i: number, arr: any[]) => {
            return (
              <Message {...msg} direction={msg.user === this.props.user._id ? 'right' : 'left'} key={i} />
            )
          })}
        </ScrollView>
        <ChatInput
          onSend={(message: string) => this.sendMessage(message)}
          onSendImage={image => console.log(image)}
        />
      </KeyboardAvoidingView>
    )
  }
}

const style = {
  matchWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.transparent,
    flexDirection: 'column' as 'column',
    display: 'flex' as 'flex',
  },
  matchScroll: {
    width,
    flexGrow: 0,
    flex: 0,
    backgroundColor: colors.transparent,
  },
}
