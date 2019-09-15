import React from 'react'
import {
  Dimensions,
  PushNotificationIOS,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

import { colors, type } from '../../../../new_foundation'
import FeatherButton from '../../../components/Camera/CameraButton'

import MatchRow from '../../../components/Matches/Match'
import MatchQueue from '../../../components/Matches/QueueMatch'

import { ApiResponse } from 'apisauce';
import { authedApi } from '../../../lib/api'

import { ifIphoneX } from 'react-native-iphone-x-helper';

import moment from 'moment';
import { previewDate } from '../../../actions/matches'
import { ReduxStore } from '../../../types/models';

const { width, height } = Dimensions.get('window')

interface IProps {
  user: any,
  currentRoute: any,
  // shouldUpdate: boolean
  enqueuedMatches: any[]
  uninitializedMatches: any[]
  chatMatches: any[]
  message: string
  disablePrerender?: boolean
  getMatches: () => any
  openChat: (matchId: string) => any
  previewDate: (match: ReduxStore.Match) => void
}
interface IState {
  prerendered: boolean
}

export default class MatchesComponent extends React.Component<IProps, IState> {
  public state: IState = {
    prerendered: false,
  }
  constructor(props: IProps) {
    super(props)
  }
  // public shouldComponentUpdate() {
  //   if(!this.state.prerendered && !this.props.disablePrerender) {
  //     this.setState({ prerendered: true })
  //     return true
  //   }
  //   return !!this.props.shouldUpdate
  // }
  // public componentDidMount() {
  //   this.props.getMatches()
  // }
  public render() {
    return (
      <View style={style.matchWrapper}>
        <View style={style.queueContainer}>
          <Text style={style.header}>
            WAITING FOR YOU
          </Text>
          <ScrollView
            style={style.queueListWrapper}
            contentContainerStyle={style.queueListContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <MatchQueue onPress={() => console.log('activated enqueued queue')} enqueued />
            {this.props.uninitializedMatches.length ? this.props.uninitializedMatches.map((match, i, arr) => {
              console.log('Here are match: ', match)
              return (
                <MatchQueue
                  key={i}
                  source={match.userProfiles[0] ? match.userProfiles[0].profile.images[0] : null}
                  onPress={() => this.props.openChat(match._id.toString())}
                />
              )
            }) : null}
          </ScrollView>
          {/* <LinearGradient
            style={style.queueGradientLeft}
            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            locations={[0, 0.5, 1]}
          />
          <LinearGradient
            style={style.queueGradientRight}
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 1)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            locations={[0, 0.5, 1]}
          /> */}
        </View>
        <Text style={style.header}>
            MY CONNECTIONS
        </Text>
        <ScrollView
          style={style.chatListWrapper}
          contentContainerStyle={style.chatListContainer}
        >
          {this.props.chatMatches.length ? this.props.chatMatches.map((match, i, arr) => {
            const chatStyle = style.chatPreview
            const lastChat = match && match.chat.length ? match.chat[match.chat.length - 1] : null
            console.log('getting candidate?', match)
            const candidate = match.userProfiles[0]._id === this.props.user._id ?
              match.userProfiles[1] :
              match.userProfiles[0]
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
            for(let ii = match.dates.length; ii--;) {
              if(!match.dates[ii].consumed && moment(match.dates[ii].expiresOn).isAfter(moment())) {
                venueLogo = match.dates[ii].logo
                break;
              }
            }
            return (
              <TouchableOpacity
                key={i}
                onPress={() => this.props.openChat(match._id)}
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
                      <TouchableOpacity onPress={() => this.props.previewDate(match)}>
                        <FastImage
                          source={{ uri: venueLogo  }}
                          resizeMode="contain"
                          style={{ width: 50, height: 50 }}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            )
          }) : null}
          {/* {this.props.chatMatches.length ? this.props.chatMatches.map((match, i, arr) => {
            const chatStyle = style.chatPreview
            const lastChat = match && match.chat.length ? match.chat[match.chat.length - 1] : null
            const candidate = match && match.userProfiles[0]._id === this.props.user._id ?
              match.userProfiles[1] :
              match.userProfiles[0]
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
            let recentDate = null
            if(match.dates.length) {
              for(let ii = match.dates.length; ii--;) {
                if(!match.dates[ii].consumed) {
                  recentDate = match.dates[ii]
                  break
                }
              }
            }
            return (
              <TouchableOpacity
                key={i}
                onPress={() => this.props.openChat(match._id)}
              >
                <View style={chatStyle.container}>
                    <FastImage
                      source={{ uri: candidate.profile.images[0] }}
                      style={chatStyle.thumbnail}
                    />
                    // {lastChat.user.toString() && <View style={chatStyle.badge} />}
                </View>
              </TouchableOpacity>
            )
          }) : null} */}
        </ScrollView>
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
    backgroundColor: colors.shadow,
  },
  header: {
    ...type.title2,
    marginLeft: 16,
  },
  queueGradientLeft: {
    width: 32,
    height: 100,
    left: 0,
    bottom: 0,
    position: 'absolute' as 'absolute',
  },
  queueGradientRight: {
    width: 32,
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
    // justifyContent: 'center' as 'center',
    // alignItems: 'stretch' as 'stretch',
    width: width-24,
    // flexWrap: 'wrap' as 'wrap',
    // flexGrow: 1,
    // flex: 1,
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
      borderRadius: 32,
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
    button: {

    },
  },
}
