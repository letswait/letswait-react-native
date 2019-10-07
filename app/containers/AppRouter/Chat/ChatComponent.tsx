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
  Keyboard,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewToken,
} from 'react-native'
import FastImage from 'react-native-fast-image'

import { colors, type } from '../../../../new_foundation'

import BoundedContentView from '../../../components/BoundedContentView'

import ChatInput from '../../../components/Chat/ChatInput'
import Message from '../../../components/Chat/Message'
import { ReduxStore } from '../../../types/models';

import { ifIphoneX } from 'react-native-iphone-x-helper'

import moment from 'moment'
import FeatherButton from '../../../components/Camera/CameraButton'
import DateInvite from '../../../components/Chat/DateInvite';
import { IMediaReference } from '../../../types/photos'

import DynamicListContainer from '../../../components/DynamicListContainer'

import LinearGradient from 'react-native-linear-gradient'
import { ObjectOf } from 'app/types/helpers';

// import { presentLocalNotification } from '../../../lib/NotificationService'

const { width, height } = Dimensions.get('window')

interface IProps {
  user: any,
  match?: ReduxStore.Match,
  postMessage: (matchId: string, message: ReduxStore.IMessage) => void
  push: (route: string) => void
}
interface IState {
  keyboardVisible: Animated.Value
  refresh: boolean
}
export default class MatchesComponent extends React.PureComponent<IProps, IState> {
  public scrollPosition: number = 0
  public scrollVelocity: number = 0
  private messages: ObjectOf<DynamicListContainer> = {}
  public state: IState = {
    keyboardVisible: new Animated.Value(0),
    refresh: false,
  }
  constructor(props: IProps) {
    super(props)
    this.handleChatDelay = this.handleChatDelay.bind(this)
    this.handleChatScroll = this.handleChatScroll.bind(this)
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(prevState.refresh !== this.state.refresh) {
      this.setState({ refresh: !this.state.refresh })
    }
  }
  public sendMessage(message: {
    text?: string,
    image?: string,
    video?: string,
    location?: ReduxStore.Point,
    campaignId?: string,
  }) {
    this.props.postMessage(this.props.match!._id, message)
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
  public handleChatScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    this.scrollVelocity = e.nativeEvent.contentOffset.y - this.scrollPosition
    this.scrollPosition = e.nativeEvent.contentOffset.y
    const velocity = Math.abs(this.scrollPosition - (this.offset || 0))
    this.offset = this.scrollPosition;
    // tslint:disable-next-line: no-unused-expression
    velocity > 15 && Keyboard.dismiss()
  }
  public handleChatDelay({
    viewableItems,
    changed,
  }: {
    viewableItems: ViewToken[],
    changed: ViewToken[],
  }) {
    let foundItems = 0
    const viewableItemCount = viewableItems.length
    for(let i = viewableItemCount; i--;) {
      const foundMessage = this.messages[viewableItems[i].item._id]
      if(!!foundMessage) {
        const position = Math.min(15, this.scrollVelocity > 0 ? viewableItemCount - foundItems : foundItems)
        const decay = position * position/15
        foundMessage.onScroll(
          decay * this.scrollVelocity,
          decay * 3,
          250,
        )
        foundItems++
      }
    }
  }
  public offset: number | undefined
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
    // presentLocalNotification('Test')
    return (
      <ScrollView
        style={{ width, height }}
        contentContainerStyle={{ width, height }}
        scrollEnabled={false}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
      >
        <LinearGradient
          colors={['#9EE3FE', '#89D4F2']}
          style={style.backgroundSubtleGradient}
        />
        <KeyboardAvoidingView
          style={style.matchWrapper}
          behavior="padding"
        >
          <ChatInput
            onSend={(message: ReduxStore.IMessage) => this.sendMessage(message)}
            keyboardWillHide={() => this.keyboardWillHide()}
            keyboardWillShow={() => this.keyboardWillShow()}
          />
          <BoundedContentView>
            {this.props.match &&
              <FlatList
                keyboardDismissMode="none"
                scrollEventThrottle={16}
                keyboardShouldPersistTaps={'always'}
                style={style.matchScroll}
                showsVerticalScrollIndicator={false}
                // contentContainerStiyle={style.scrollContainer}
                ListHeaderComponent={<View style={{ height: 8 }}/>}
                inverted
                data={chatData}
                keyExtractor={(item, index) => item._id}
                extraData={this.state.refresh}
                onViewableItemsChanged={this.handleChatDelay}
                onScroll={this.handleChatScroll}
                renderItem={({ item, index }) => {
                  if(item.message.location) {
                    const date = this.props.match!.dates[0]
                    return (
                      <DynamicListContainer
                        vertical={true}
                        ref={c => c ? this.messages[item._id] = c : null}
                        maxOffset={16}
                      >
                        <DateInvite
                          {...date}
                          largeMargins={this.props.match!.chat.length <= 1}
                          userName={this.props.user.name}
                          matchName={this.props.match!.userProfiles[0].name}
                        />
                      </DynamicListContainer>
                    )
                  }
                  const lastDirection = `${lastDir || ''}`
                  const showUser =
                    (lastDir === 'right' && item.user !== this.props.user._id) ||
                    (lastDir === 'left' && item.user === this.props.user._id)
                  const direction = item.user === this.props.user._id ? 'right' : 'left'
                  lastDir = direction
                  const lastTimestamp = moment(lastTime).toDate()
                  const nextTimestamp =
                    chatData[index + 1] ? moment(chatData[index + 1].sentTimestamp).toDate() :
                    new Date()
                  // Recent (null sentTimestamp) messages Automatically grouped, will auto sort
                  // and group according to server once its loaded in and out of memory
                  lastTime = moment(item.sentTimestamp || lastTime).toDate()
                  const loading = !item.sentTimestamp
                  return  (
                    <DynamicListContainer
                        vertical={true}
                        ref={c => c ? this.messages[item._id] = c : null}
                        maxOffset={16}
                    >
                      <Message
                        {...item}
                        key={item._id}
                        direction={direction}
                        lastDirection={lastDirection as any}
                        nextTimestamp={nextTimestamp}
                        lastTimestamp={lastTimestamp}
                        loading={loading}
                        source={direction === 'right' ? {
                          uri: this.props.user.profile.images[0],
                        } : {
                          uri: matchedUser!.profile.images[0],
                        }}
                      />
                    </DynamicListContainer>
                  )
                }}
              />
            }
          </BoundedContentView>
          <View style={style.chatHeader}>
            <FeatherButton
              name="chevron-left"
              color={colors.white}
              size={32}
              style={style.headerButton}
              onPress={() => {
                Keyboard.dismiss()
                this.props.push('/app/matches')
              }}
            />
            <Text style={style.chatTitle}>
              {matchedUser ? matchedUser.name : ''}
            </Text>
            <FeatherButton
              name="more-vertical"
              color={colors.white}
              size={28}
              style={style.headerButton}
              onPress={() => this.props.push('/app/matches')}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }
}

const style = {
  backgroundSubtleGradient: {
    height,
    width,
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
  },
  matchWrapper: {
    width,
    flex: 1,
    flexGrow: 1,
    maxHeight: height - ifIphoneX(84, 64),
    flexDirection: 'column-reverse' as 'column-reverse',
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
    backgroundColor: 'rgba(0,145,180, 0.35)',
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
    textTransform: 'uppercase' as 'uppercase',
    marginBottom: ifIphoneX(22, 16),
  },
}
