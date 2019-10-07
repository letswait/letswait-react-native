import React from 'react'
import {
  Alert,
  // ScrollView,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

import { colors, type } from '../../../../new_foundation'

import QueuedMatch from '../../../components/Matches/QueueMatch'

import { ifIphoneX } from 'react-native-iphone-x-helper';

import moment from 'moment';
import { ReduxStore } from '../../../types/models';

import { ObjectOf } from 'app/types/helpers'
import DynamicListContainer from '../../../components/DynamicListContainer'

const { width, height } = Dimensions.get('window')

interface IFlatListMatch {
  item: ReduxStore.Match
  index?: number
}

interface IProps {
  user: any,
  currentRoute: any,
  enqueuedMatches: any[]
  uninitializedMatches: ReduxStore.Match[]
  chatMatches: any[]
  message: string
  getMatches: () => any
  openChat: (matchId: string) => any
  previewDate: (match: ReduxStore.Match) => void
}
interface IState {
  prerendered: boolean
}

export default class MatchesComponent extends React.PureComponent<IProps, IState> {
  public matchQueueScrollPosition: number = 0
  public chatMatchScrollPosition: number = 0
  public matchQueueScrollVelocity: number = 0
  public chatMatchScrollVelocity: number = 0
  public queuedMatches: ObjectOf<DynamicListContainer> = {}
  public chatMatches: ObjectOf<DynamicListContainer> = {}
  public state: IState = {
    prerendered: false,
  }
  constructor(props: IProps) {
    super(props)
    this.handleMatchQueueDelay = this.handleMatchQueueDelay.bind(this)
    this.handleChatMatchDelay = this.handleChatMatchDelay.bind(this)
    this.handleMatchQueueScroll = this.handleMatchQueueScroll.bind(this)
    this.handleChatMatchScroll = this.handleChatMatchScroll.bind(this)
    this.renderQueuedMatch = this.renderQueuedMatch.bind(this)
  }
  public handleMatchQueueScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    this.matchQueueScrollVelocity = this.matchQueueScrollPosition - e.nativeEvent.contentOffset.x
    this.matchQueueScrollPosition = e.nativeEvent.contentOffset.x
  }
  public handleMatchQueueDelay({
    viewableItems,
    changed,
  }: {
    viewableItems: ViewToken[],
    changed: ViewToken[],
  }) {
    let foundItems = 0
    const viewableItemCount = viewableItems.length
    for(let i = viewableItemCount; i--;) {
      const foundMatch = this.queuedMatches[viewableItems[i].item._id]
      if(!!foundMatch) {
        foundMatch.onScroll(
          this.matchQueueScrollVelocity * (foundItems),
          20 + this.matchQueueScrollVelocity > 0 ? (viewableItemCount - foundItems) * 5 : foundItems * 5,
        )
        foundItems++
      }
    }
  }
  public renderQueuedMatch({ item, index }: IFlatListMatch) {
    return (
      <DynamicListContainer
        vertical={false}
        ref={c => c ? this.queuedMatches[item._id] = c : null}
        maxOffset={16}
      >
        {index ? (
          <QueuedMatch
            onPress={() => this.props.openChat(item._id.toString())}
            source={
              (item as ReduxStore.Match).userProfiles[0] ?
                (item as ReduxStore.Match).userProfiles[0].profile.images[0]
                : undefined
            }
          />
        ) : (
          <QueuedMatch onPress={() => console.log('activated enqueued queue')} enqueued />
        )}
      </DynamicListContainer>
    )
  }
  public handleChatMatchScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    this.chatMatchScrollVelocity = e.nativeEvent.contentOffset.y - this.chatMatchScrollPosition
    this.chatMatchScrollPosition = e.nativeEvent.contentOffset.y
  }
  public handleChatMatchDelay({
    viewableItems,
    changed,
  }: {
    viewableItems: ViewToken[],
    changed: ViewToken[],
  }) {
    let foundItems = 0
    const viewableItemCount = viewableItems.length
    for(let i = viewableItemCount; i--;) {
      const foundMatch = this.chatMatches[viewableItems[i].item._id]
      if(!!foundMatch) {
        const position = Math.min(10, this.chatMatchScrollVelocity > 0 ? viewableItemCount - foundItems : foundItems)
        const decay = position * position/-5
        foundMatch.onScroll(
          decay * this.chatMatchScrollVelocity,
          decay * 10,
          200,
        )
        foundItems++
      }
    }
  }
  public render() {
    return (
      <View style={style.matchWrapper}>
        <View style={style.queueContainer}>
          <Text style={style.header}>
            WAITING FOR YOU
          </Text>
          <FlatList
            style={style.queueListWrapper}
            contentContainerStyle={style.queueListContainer}
            horizontal
            scrollEventThrottle={16}
            keyExtractor={item => typeof item._id === 'string' ? item._id : item._id.toString()}
            showsHorizontalScrollIndicator={false}
            extraData={this.props.uninitializedMatches}
            data={[{ _id: '0000' } as ReduxStore.Match, ...this.props.uninitializedMatches]}
            onViewableItemsChanged={this.handleMatchQueueDelay}
            onScroll={this.handleMatchQueueScroll}
            renderItem={this.renderQueuedMatch}
          />
          <LinearGradient
            style={style.queueGradientLeft}
            colors={['rgba(87, 166, 171, 1)', 'rgba(87, 166, 171, 0.74)', 'rgba(87, 166, 171, 0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            locations={[0, 0.28, 1]}
          />
          <LinearGradient
            style={style.queueGradientRight}
            colors={['rgba(87, 166, 171, 0)', 'rgba(87, 166, 171, 0.74)', 'rgba(87, 166, 171, 1)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            locations={[0, 0.28, 1]}
          />
        </View>
        <Text style={style.header}>
            MY CONNECTIONS
        </Text>
        <FlatList
          style={style.chatListWrapper}
          contentContainerStyle={style.chatListContainer}
          data={this.props.chatMatches}
          extraData={this.props.chatMatches}
          scrollEventThrottle={16}
          keyExtractor={item => typeof item._id === 'string' ? item._id : item._id.toString()}
          onViewableItemsChanged={this.handleChatMatchDelay}
          onScroll={this.handleChatMatchScroll}
          renderItem={({ item, index }) => {
            const chatStyle = style.chatPreview
            const lastChat = item && item.chat.length ? item.chat[item.chat.length - 1] : null
            const candidate = item.userProfiles[0]
            let lastChatMessage: string = ''
            const lastChatOwned: boolean = lastChat && lastChat.user === this.props.user._id
            if(!!lastChat && !!lastChat.message) {
              if(!!lastChat.message.location) {
                lastChatMessage =
                  // tslint:disable-next-line: max-line-length
                  `${lastChatOwned ? 'You' : candidate.name} invited ${lastChatOwned ? candidate.name : 'you'} to a date!`
              } else if(!!lastChat.message.cloudfront) {
                lastChatMessage =
                  `${lastChatOwned ? 'You' : candidate.name} shared a video.`
              } else if(!!lastChat.message.image) {
                lastChatMessage =
                  `${lastChatOwned ? 'You' : candidate.name} shared a photo.`
              } else {
                lastChatMessage = lastChat.message.text || ''
              }
            }
            let venueLogo = ''
            for(let ii = item.dates.length; ii--;) {
              if(!item.dates[ii].consumed && moment(item.dates[ii].expiresOn).isAfter(moment())) {
                venueLogo = item.dates[ii].logo
                break;
              }
            }
            return (
              <DynamicListContainer
                vertical={true}
                ref={c => c ? this.chatMatches[item._id] = c : null}
                maxOffset={24}
              >
                <TouchableOpacity
                  onPress={() => this.props.openChat(item._id)}
                >
                  <View style={chatStyle.container}>
                    <View style={chatStyle.imageWrapper}>
                      <FastImage
                        source={{ uri: candidate.profile.images[0] }}
                        style={chatStyle.thumbnail}
                      />
                      {/* {lastChat.user.toString() && <View style={chatStyle.badge} />} */}
                    </View>
                    <View style={chatStyle.previewWrapper}>
                      <Text style={chatStyle.header}>{candidate.name}</Text>
                      <Text style={chatStyle.lastMessage} numberOfLines={2}>
                        {lastChatMessage}
                      </Text>
                    </View>
                    <View style={chatStyle.actionWrapper}>
                      {venueLogo ? (
                        <TouchableOpacity onPress={() => this.props.previewDate(item)}>
                          <FastImage
                            source={{ uri: venueLogo  }}
                            resizeMode="contain"
                            style={{ width: 50, height: 50 }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={{
                            width: 50,
                            height: 24,
                            marginTop: 13,
                            marginBottom: 13,
                            position: 'relative',
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              width: 50,
                              height: 24,
                              left: 0,
                              top: 0,
                              position: 'absolute' as 'absolute',
                              transform: [{ scale: 1.3 }],
                              borderRadius: 4,
                              backgroundColor: colors.seafoam,
                            }}
                            onPress={() => Alert.alert('Second Dates are not enabled')}
                          />
                          <Text
                            style={{
                              ...type.micro,
                              textTransform: 'uppercase' as 'uppercase',
                              color: colors.white,
                              zIndex: 1,
                              position: 'absolute' as 'absolute',
                              width: 50,
                              height: 24,
                              textAlignVertical: 'center' as 'center',
                              textAlign: 'center' as 'center',
                              left: 0,
                              top: 0,
                            }}
                            pointerEvents={'none'}
                          >
                            INVITE ON DATE
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </DynamicListContainer>
            )
          }}
        />
      </View>
    )
  }
}

const style = {
  matchWrapper: {
    width,
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column' as 'column',
    maxHeight: height - ifIphoneX(84,64),
  },
  queueContainer: {
    flex: 0,
    flexDirection: 'column' as 'column',
    paddingTop: ifIphoneX(60, 32),
    paddingBottom: 24,
    marginBottom: 16,
    backgroundColor: colors.capri,
  },
  header: {
    ...type.title2,
    marginLeft: 16,
  },
  queueGradientLeft: {
    width: 75,
    height: 100,
    left: 0,
    bottom: 0,
    position: 'absolute' as 'absolute',
  },
  queueGradientRight: {
    width: 75,
    height: 100,
    right: 0,
    bottom: 0,
    position: 'absolute' as 'absolute',
  },
  queueListWrapper: {
    width,
    marginTop: 8,
    marginbottom: 28,
  },
  queueListContainer: {
    paddingLeft: 16,
  },
  chatListWrapper: {
    marginLeft: 12,
    marginRight: 12,
    width: width - 24,
    marginTop: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden' as 'hidden',
  },
  chatListContainer: {
    flexDirection: 'column' as 'column',
    width: width-24,
  },
  chatPreview: {
    container: {
      height: 99,
      width: '100%',
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      backgroundColor: 'transparent',
      padding: 16,
      paddingRight: 24,
    },
    imageWrapper: {
      height: 64,
      width: 64,
      flex: 0,
    },
    thumbnail: {
      height: 64,
      width: 64,
      borderRadius: 30,
      overflow: 'hidden' as 'hidden',
    },
    badge: {
      position: 'absolute' as 'absolute',
      top: 0,
      right: 0,
      height: 20,
      width: 20,
      borderRadius: 10,
      backgroundColor: colors.turmeric,
    },
    previewWrapper: {
      flex: 1,
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'flex-start' as 'flex-start',
      justifyContent: 'center' as 'center',
      backgroundColor: 'transparent',
      paddingLeft: 16,
      paddingRight: 16,
      marginTop: 6,
    },
    header: {
      ...type.regular,
      color: colors.cosmos,
      paddingBottom: 8,
      textAlign: 'left' as 'left',
      flex: 0,
    },
    lastMessage: {
      flex: 1,
      ...type.small,
      height: 34,
      color: colors.shadow,
    },
    actionWrapper : {
      flex: 0,
      width: 50,
      height: 50,
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      backgroundColor: 'transparent',
    },
  },
}
