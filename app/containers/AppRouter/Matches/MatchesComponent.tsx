import React from 'react'
import {
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

interface IProps {
  user: any,
  currentRoute: any,
  shouldUpdate: boolean
  enqueuedMatches: any[]
  uninitializedMatches: any[]
  chatMatches: any[]
  message: string
  getMatches: () => any
  openChat: (matchId: string) => any
}
const matchQueue = [
  // tslint:disable-next-line: max-line-length
  { img: 'https://letswait-development.s3.amazonaws.com/uploads/profile/72tPYUE9FEif2sXIrTPyQesN162SAY3gF6t1BFUgYyNVkEwnAYNMMHzmU5CzGxYd.jpg' },
]

export default class MatchesComponent extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public shouldComponentUpdate() {
    return this.props.shouldUpdate
  }
  public componentDidMount() {
    this.props.getMatches()
  }
  public render() {
    return (
      <View style={style.matchWrapper}>
        <View style={style.queueContainer}>
          <Text style={style.header}>
            Match Queue
          </Text>
          <ScrollView
            style={style.queueListWrapper}
            contentContainerStyle={style.queueListContainer}
            horizontal
          >
            <MatchQueue onPress={() => console.log('activated enqueued queue')} enqueued />
            {this.props.uninitializedMatches.length ? this.props.uninitializedMatches.map((match, i, arr) => {
              return (
                <MatchQueue
                  key={i}
                  source={match.userProfiles[0].profile.images[0]}
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
            Matches
        </Text>
        <ScrollView
          style={style.chatListWrapper}
          contentContainerStyle={style.chatListContainer}
        >
          {this.props.chatMatches.length ? this.props.chatMatches.map((match, i, arr) => {
            const chatStyle = style.chatPreview
            const lastChat = match && match.chat.length ? match.chat[match.chat.length - 1] : null
            const candidate = match.userProfiles[0]._id === this.props.user._id ?
              match.userProfiles[1] :
              match.userProfiles[0]
            let lastChatMessage: string = ''
            const lastChatOwned: boolean = lastChat && lastChat.user === this.props.user._id
            if(!!lastChat) {
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
                    <FeatherButton
                      style={chatStyle.button}
                      onPress={() => console.log('pressed button')}
                      color={colors.wisteria}
                      size={28}
                      name={recentDate ? 'tag' : 'calendar'}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )
          }) : null}
        </ScrollView>
      </View>
    )
  }
}

const style = {
  matchWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.transparent,
    flexDirection: 'column' as 'column',
  },
  queueContainer: {
    flex: 0,
    flexDirection: 'column' as 'column',
    paddingTop: 16,
    paddingBottom: spacing.tiny,
    marginBottom: spacing.base,
    borderBottomWidth: 1,
    // borderStyle: 'dashed' as 'dashed',
    borderColor: 'rgba(147, 114, 190, 0.2)',
  },
  header: {
    ...type.regular,
    fontWeight: '600' as '600',
    color: colors.wisteria,
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
    width: '100%',
  },
  queueListContainer: {

  },
  chatListWrapper: {

  },
  chatListContainer: {
    paddingTop: spacing.tiny,
  },
  chatPreview: {
    container: {
      height: 64,
      width: '100%',
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      backgroundColor: colors.transparent,
      marginTop: 16,
      marginBottom: 16,
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
      backgroundColor: colors.wisteria,
    },
    previewWrapper: {
      flex: 1,
      height: 64,
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'flex-start' as 'flex-start',
      justifyContent: 'center' as 'center',
      backgroundColor: colors.transparent,
      paddingLeft: spacing.small,
      paddingRight: spacing.small,
    },
    header: {
      ...type.regular,
      color: colors.wisteria,
      paddingBottom: 8,
      textAlign: 'left' as 'left',
      flex: 0,
    },
    lastMessage: {
      flex: 1,
      ...type.small,
      color: colors.lilac,
    },
    actionWrapper : {
      flex: 0,
      width: 64,
      height: 64,
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      backgroundColor: colors.transparent,
    },
    button: {

    },
  },
}
