import React from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'

import { colors, spacing, type } from '../../../../foundation'
import FeatherButton from '../../../components/Camera/CameraButton'

interface IProps {
  shouldUpdate: boolean
}
interface IState {
  queueMatches: any[]
  matchChats: any[]
}
export default class FeedComponent extends React.Component<IProps, IState> {
  public state = {
    queueMatches: [],
    matchChats: [],
  }
  constructor(props: IProps) {
    super(props)
  }
  public shouldComponentUpdate() {
    return this.props.shouldUpdate
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
          >
            {this.state.queueMatches.length ? this.state.queueMatches.map((match, i, arr) => {
              return (
                <Text key={i}>{i}</Text>
              )
            }) : null}
          </ScrollView>
        </View>
        <ScrollView
          style={style.chatListWrapper}
          contentContainerStyle={style.chatListContainer}
        >
          {this.state.matchChats.length ? this.state.matchChats.map((match: any, i, arr) => {
            const chatStyle = style.chatPreview
            return (
              <TouchableOpacity
                key={i}
                onPress={() => console.log('pressed main button, ', i)}
              >
                <View style={chatStyle.container}>
                  <View style={chatStyle.imageWrapper}>
                    <FastImage
                      source={{ uri: match.uri }}
                    />
                    {match.hasSeen && <View style={chatStyle.badge} />}
                  </View>
                  <View>
                    <Text style={chatStyle.header}>{match.name}</Text>
                    <Text style={chatStyle.lastMessage}>
                      {match.lastMessage}
                    </Text>
                  </View>
                  <View>
                    <FeatherButton
                      style={chatStyle.button}
                      onPress={() => console.log('pressed button')}
                      color={colors.wisteria}
                      size={26}
                      name={match.couponCodeId ? 'tag' : 'calendar'}
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
  },
  header: {
    ...type.regular,
    fontWeight: '600' as '600',
    color: colors.wisteria,
  },
  queueListWrapper: {
    width: '100%',
  },
  queueListContainer: {

  },
  chatListWrapper: {

  },
  chatListContainer: {

  },
  chatPreview: {
    container: {

    },
    imageWrapper: {

    },
    badge: {

    },
    header: {

    },
    lastMessage: {

    },
    button: {

    },
  },
}
