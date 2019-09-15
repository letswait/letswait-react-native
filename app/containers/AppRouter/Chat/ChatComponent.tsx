import React from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'

import { colors, type } from '../../../../new_foundation'

import BoundedContentView from '../../../components/BoundedContentView'

import ChatInput from '../../../components/Chat/ChatInput'
import Message from '../../../components/Chat/Message'
import { ReduxStore } from '../../../types/models';

import config from '../../../../config'

import socket from 'socket.io-client'

import { ifIphoneX } from 'react-native-iphone-x-helper'

import { IMediaReference } from 'app/types/photos'
import moment from 'moment'
import FeatherButton from '../../../components/Camera/CameraButton'

const { width, height } = Dimensions.get('window')

interface IProps {
  user: any,
  // shouldUpdate: boolean,
  disablePrerender?: boolean
  match?: ReduxStore.Match,
  pushChat: (matchId: string, message: ReduxStore.IChat) => void
  push: (route: string) => void
}
interface IState {
  keyboardVisible: Animated.Value
}
export default class MatchesComponent extends React.PureComponent<IProps, IState> {
  private socket: any
  public state: IState = {
    keyboardVisible: new Animated.Value(0),
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
      props.pushChat(res.matchId, res.chat)
    })
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(this.props.match) {
      if(prevProps.match && prevProps.match._id.toString() !== this.props.match._id.toString()) {
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
  }
  public sendMessage(message: string) {
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
  public keyboardWillShow() {
    Animated.timing(this.state.keyboardVisible, {
      toValue: 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start()
  }
  public keyboardWillHide() {
    Animated.timing(this.state.keyboardVisible, {
      toValue: 0,
      duration: 300,
    }).start()
  }
  public scrollView: any = null
  public render() {
    const matchedUserIndex = this.props.match ?
      this.props.match.userProfiles[0]._id === this.props.user._id ?
        1 : 0 :
      undefined
    let matchedUser: ReduxStore.IMatchUser | undefined;

    if(matchedUserIndex !== undefined) {
      matchedUser = this.props.match!.userProfiles[matchedUserIndex]
    }
    const chatData = this.props.match ? [...this.props.match.chat].reverse() : []
    let lastDir: 'left' | 'right' | null = null
    let lastTime: Date  | undefined
    return (
      <ScrollView
        style={{ width, height }}
        contentContainerStyle={{ width, height }}
        scrollEnabled={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        <KeyboardAvoidingView style={style.matchWrapper} behavior="padding">
          <View style={style.chatHeader}>
            <FeatherButton
              name="chevron-left"
              color={colors.white}
              size={32}
              style={style.headerButton}
              onPress={() => this.props.push('/app/matches')}
            />
            <Text style={style.chatTitle}>
              {matchedUser ? matchedUser.name : ''}
            </Text>
            <FeatherButton
              name="more-vertical"
              color={colors.white}
              size={32}
              style={style.headerButton}
              onPress={() => this.props.push('/app/matches')}
            />
          </View>
          <BoundedContentView>
            {this.props.match &&
              <FlatList
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
                style={style.matchScroll}
                showsVerticalScrollIndicator={false}
                // contentContainerStiyle={style.scrollContainer}
                ListHeaderComponent={<View style={{ height: 8 }}/>}
                inverted
                data={chatData}
                renderItem={({ item, index }) => {
                  const lastDirection = `${lastDir || ''}`
                  const showUser =
                    (lastDir === 'right' && item.user !== this.props.user._id) ||
                    (lastDir === 'left' && item.user === this.props.user._id)
                  const direction = item.user === this.props.user._id ? 'right' : 'left'
                  lastDir = direction
                  const lastTimestamp = moment(lastTime).toDate()
                  const nextTimestamp =
                    chatData[index + 1] ? moment(chatData[index + 1].sentTimestamp).toDate() :
                    undefined
                  // Recent (null sentTimestamp) messages Automatically grouped, will auto sort
                  // and group according to server once its loaded in and out of memory
                  lastTime = moment(item.sentTimestamp || lastTime).toDate()
                  return  (
                    <Message
                      {...item}
                      key={item._id}
                      direction={direction}
                      lastDirection={lastDirection as any}
                      nextTimestamp={nextTimestamp}
                      lastTimestamp={lastTimestamp}
                      source={direction === 'right' ? {
                        uri: this.props.user.profile.images[0],
                      } : {
                        uri: matchedUser!.profile.images[0],
                      }}
                    />
                  )
                }}

                keyExtractor={(item, index) => item._id}
                extraData={this.props.match.chat}
              />
            }
          </BoundedContentView>
          <ChatInput
            onSend={(message: string) => this.sendMessage(message)}
            onSendImage={image => console.log(image)}
            keyboardWillHide={() => this.keyboardWillHide()}
            keyboardWillShow={() => this.keyboardWillShow()}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }
}

const style = {
  nav: {
    width,
    height: ifIphoneX(84, 64),
    flexDirection: 'row' as 'row',
    justifyContent: 'space-around' as 'space-around',
    alignItems: 'flex-end' as 'flex-end',
    backgroundColor: 'yellow',
    overflow: 'hidden' as 'hidden',
  },
  navIcon: {
    marginTop: 16,
    marginBottom: ifIphoneX(39,20),
    width: 26,
    height: 26,
  },
  matchWrapper: {
    width,
    flex: 1,
    flexGrow: 1,
    maxHeight: height - ifIphoneX(84, 64),
    flexDirection: 'column' as 'column',
    display: 'flex' as 'flex',
  },
  matchScroll: {
    width: width - 24,
    flexGrow: 1,
    flex: 1,
    marginBotttom: 8,
    backgroundColor: 'transparent',
    // justifyContent: 'flex-end' as 'flex-end',
  },
  scrollContainer: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'flex-end' as 'flex-end',
  },
  chatHeader: {
    width,
    height: ifIphoneX(104, 88),
    backgroundColor: colors.shadow,
    flexDirection: 'row' as 'row',
    alignItems: 'flex-end' as 'flex-end',
    justifyContent: 'space-between' as 'space-between',
    flexGrow: 0,
    flex: 0,
  },
  headerButton: {
    width: 32,
    height: 32,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: ifIphoneX(17, 11),
  },
  chatTitle: {
    ...type.title2,
    marginBottom: ifIphoneX(22, 16),
  },
}
