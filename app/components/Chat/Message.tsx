import React from 'react'
import {
  Animated,
  Easing,
  Text,
  TouchableHighlight,
  View,
  Alert,
} from 'react-native'

import FastImage from 'react-native-fast-image'
import MapView, { LatLng, Marker } from 'react-native-maps'

import LeftMessageContainer from './LeftMessageContainer'
import RightMesssageContainer from './RightMessageContainer'

import { colors, type } from '../../../new_foundation';
import { ReduxStore } from '../../types/models'

import { IMediaReference } from 'app/types/photos'
import moment from 'moment';

interface IProps extends ReduxStore.IChat {
  direction: 'left' | 'right' | null
  lastDirection: 'left' | 'right' | null
  nextTimestamp?: Date
  lastTimestamp?: Date
  source: IMediaReference
  key: number | string,
}
interface IState {
  displayTime?: string
  groupChat: boolean
}
export default class Message extends React.PureComponent<IProps, IState> {
  public state: IState = {
    displayTime: undefined,
    groupChat: false,
  }
  constructor(props: IProps) {
    super(props)
    // if(props.source && props.)
    let prefix: 'Sent' | 'Read' = 'Sent'
    const newMoment = (() => {
      if(props.readTimestamp) {
        prefix = 'Read'
        return props.readTimestamp
      }
      return props.sentTimestamp
    })()
    this.state.displayTime =
    this.props.lastDirection !== this.props.direction ?
      `${prefix} ${moment(newMoment).format('ddd MMM DD, hh:mmA')}` :
      undefined
    const diff = moment(props.sentTimestamp).diff(moment(props.nextTimestamp), 'minutes')
    if(diff < 5) {
      this.state.groupChat = true
    } else {
      this.state.displayTime = `${prefix} ${moment(newMoment).format('ddd MMM DD, hh:mmA')}`
    }
  }
  public renderMessage() {
    const { text, image, cloudfront, location, campaignId } = this.props.message

    if(image) {
      return (
        <View>
          <FastImage source={{ uri: image }}/>
          <View>
            <Text>
              {text}
            </Text>
          </View>
        </View>
      )
    }
    if(cloudfront) {
      return (
        <View>
          <Text>
            {text}
          </Text>
        </View>
      )
    }
    if(location) {
      // if(campaignId) {
      //   return null
      // }
      const lat = location.coordinates[1]
      const lon = location.coordinates[0]
      return (
        <View style={style.messageMetadataContainer}>
          <MapView
            style={style.map}
            region={{
              latitude: lat,
              longitude: lon,
              latitudeDelta: 0.003,
              longitudeDelta: 0.002,
            }}
            /**
             *  @todo We can ask venues if their are indoors, and on what level, this helps navigation through malls.
             *        In the Case they are indoors, we should use google maps always, with showsIndoors and
             *        showsIndoorsLevelPicker Added.
             */
          >
            <Marker
              coordinate={{
                latitude: lat,
                longitude: lon,
              } as LatLng}
              // {...(campaignId ? {} : {})}
            />
          </MapView>
          <View style={style.messageContainer}>
            <Text style={style.messageText}>
              {text}
            </Text>
          </View>
        </View>
      )
    }
    return (
      <View style={style.messageTextContainer}>
        <Text style={style.messageText}>
          {text}
        </Text>
      </View>
    )
  }
  public render() {
    const messageWrapper = {
      ...style.messageWrapper,
      flexDirection: this.props.direction === 'right' ?
        'row-reverse' as 'row-reverse' :
        'row' as 'row',
      marginTop: this.state.groupChat ? 2 : 13,
      paddingBottom: this.state.displayTime ? 11 : 0,
    }
    const MessageContainer = this.props.direction === 'right' ?
      RightMesssageContainer :
      LeftMessageContainer

    const displayTime = {
      ...style.displayTime,
      left: 52,
      textAlign: 'left' as 'left',
    }
    return (
      <View style={messageWrapper}>
        <View
          style={{
            width: 52,
            height: 43,
            // backgroundColor: colors.seafoam,
          }}
        >
          {this.props.source && this.state.displayTime ? (
            <FastImage
              source={this.props.source}
              style={{
                width: 43,
                height: 43,
                borderRadius: 12,
                marginLeft: 4,
                marginRight: 5,
              }}
            />
          ) : null}
        </View>
        <MessageContainer>
          {this.renderMessage()}
        </MessageContainer>
        {this.state.displayTime && this.state.displayTime.length ? (
          <Text style={displayTime}>
            {this.state.displayTime}
          </Text>
        ): null}
      </View>
    )
  }
}

const style = {
  displayTime: {
    position: 'absolute' as 'absolute',
    bottom: 0,
    ...type.micro,
    color: colors.shadow,
  },
  messageWrapper: {
    alignItems: 'flex-end' as 'flex-end',
  },
  messageMetadataContainer: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    maxWidth: 250,
  },
  messageContainer: {
    padding: 10,
    flexDirection: 'row' as 'row',
    flex: 0,
  },
  messageTextContainer: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    maxWidth: 250,
    padding: 10,
    flex: 0,
  },
  map: {
    width: 250,
    height: 150,
    marginBottom: 4,
  },
  messageText: {
    ...type.regular,
    color: colors.cosmos,
    opacity:  0.75,
    fontWeight: '500' as '500',
    flex: 1,
    textAlign: 'left' as 'left',
  },
}
