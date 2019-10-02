import React from 'react'
import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native'

import FastImage from 'react-native-fast-image'
import MapView, { LatLng, Marker } from 'react-native-maps'

import LeftMessageContainer from './LeftMessageContainer'
import RightMesssageContainer from './RightMessageContainer'

import { colors, type } from '../../../new_foundation';
import { ReduxStore } from '../../types/models'

import { IMediaReference } from 'app/types/photos'
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather'
import FeatherButton from '../Camera/CameraButton'

const { width, height } = Dimensions.get('window')

interface IProps extends ReduxStore.IChat {
  direction: 'left' | 'right' | null
  lastDirection: 'left' | 'right' | null
  nextTimestamp?: Date
  lastTimestamp?: Date
  source: IMediaReference
  key: number | string,
  loading?: boolean,
}
interface IState {
  displayTime?: string
  groupChat: boolean
  loading: Animated.Value
}
export default class Message extends React.PureComponent<IProps, IState> {
  public state: IState = {
    displayTime: undefined,
    groupChat: false,
    loading: new Animated.Value(this.props.loading ? 0.3 : 1),
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
    this.state.displayTime = newMoment && this.props.lastDirection !== this.props.direction ?
      `${prefix} ${this.calculateTimeSince(newMoment)}` :
      undefined
    const diff = moment(props.sentTimestamp).diff(moment(props.nextTimestamp), 'minutes')
    if(diff < 5) {
      this.state.groupChat = true
    } else {
      this.state.displayTime = `${prefix} ${this.calculateTimeSince(newMoment!)}`
    }
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(prevProps.loading !== this.props.loading) {
      Animated.timing(this.state.loading, {
        toValue: this.props.loading ? 0.3 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }
  public renderMessage() {
    const { text, image, video, location, campaignId } = this.props.message

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
    if(video) {
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
  public pluralize(n: number, unit: string) {
    const rationalizedNumber = Math.floor(n)
    return `${rationalizedNumber} ${unit}${rationalizedNumber === 1 ? '' : 's'}`
  }
  public calculateTimeSince(date?: Date) {
    const instance = moment(date)
    if(!instance.isValid()) return undefined
    const now = moment()
    const secondsSince = now.diff(instance, 'seconds')
    if(secondsSince < 30) {
      return 'just now' // just now
    }
    if(secondsSince < 60) {
      return `${this.pluralize(secondsSince, 'second')} ago` // 56 seconds ago
    }
    if(secondsSince < 3600) {
      return `${this.pluralize(secondsSince/60, 'minute')} ago` // 24 minutes ago
    }
    if(secondsSince < 21600) {
      return `${this.pluralize(secondsSince/3600, 'hour')} ago` // 4 hours ago
    }
    // check if it was yesterday
    const formattedTime = instance.format('h:mm A')
    if(instance.isSame(now, 'd')) {
      return `Today at ${formattedTime}` // today at 4:36 PM
    }
    const yesterday = now.clone().subtract(1, 'days').startOf('day');
    if(instance.isSame(yesterday, 'd')) {
      return `Yesterday at ${formattedTime}` // yesterday at 4:36 PM
    }
    const daysSince = Math.floor(secondsSince/86400)
    if(instance.isSame(now, 'M') && daysSince <= 7) {
      return `${this.pluralize(daysSince, 'day')} ago` // 5 days ago
    }
    if(instance.isSame(now, 'y')) {
      return instance.format('MMMM Do') // March 3rd
    }
    return instance.format('MMMM YYYY') // March 2019
  }
  public render() {
    const messageWrapper = {
      ...style.messageWrapper,
      flexDirection: this.props.direction === 'right' ?
        'row-reverse' as 'row-reverse' :
        'row' as 'row',
      paddingBottom: this.state.displayTime ? 20 : 2,
      opacity: this.state.loading,
    }
    const MessageContainer = this.props.direction === 'right' ?
      RightMesssageContainer :
      LeftMessageContainer

    const displayTime = {
      ...style.displayTime,
      left: this.props.direction === 'left' ? 52 : 4,
      textAlign: 'left' as 'left',
    }
    const displayTimeError = {
      ...style.displayTimeError,
      left: 52,
      textAlign: 'left' as 'left',
    }
    return (
      <Animated.View style={messageWrapper}>
        {this.props.direction === 'left' ? this.props.source && this.state.displayTime ? (
          <View
            style={{
              width: 43,
              height: 37,
              backgroundColor: colors.transparentWhite,
            }}
          >
            <View
              style={{
                width: 37,
                height: 37,
                borderRadius: 16,
                marginLeft: 4,
                marginRight: 2,
                shadowColor: colors.cosmos,
                shadowOpacity: 0.08,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 1 },
              }}
            >
              <FastImage
                source={this.props.source}
                style={{
                  width: 37,
                  height: 37,
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              width: 43,
              height: 37,
              backgroundColor: colors.transparentWhite,
            }}
          />
        ) : this.props.error ? (
          <View
            style={{
              width: 43,
              height: 37,
              backgroundColor: colors.transparentWhite,
              justifyContent: 'center' as 'center',
              alignItems: 'center' as 'center',
            }}
          >
            <Feather size={25} color={colors.duckbill} name="alert-circle" />
          </View>
        ) : (
          <View
            style={{
              width: 4,
              height: 37,
              backgroundColor: colors.transparentWhite,
            }}
          />
        )}
        <MessageContainer>
          {this.renderMessage()}
        </MessageContainer>
        {this.props.error ? (
          <Text style={displayTimeError}>
            {`Attempted ${this.calculateTimeSince(this.props.error)}`}
          </Text>
        ) : !this.props.loading && this.state.displayTime && this.state.displayTime.length ? (
          <Text style={displayTime}>
            {this.state.displayTime}
          </Text>
        ): null}
      </Animated.View>
    )
  }
}

const style = {
  displayTime: {
    position: 'absolute' as 'absolute',
    bottom: 8,
    ...type.micro,
    color: colors.shadow,
  },
  displayTimeError: {
    position: 'absolute' as 'absolute',
    bottom: 8,
    ...type.micro,
    color: colors.duckbill,
  },
  messageWrapper: {
    alignItems: 'flex-end' as 'flex-end',
  },
  messageMetadataContainer: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    maxWidth: width * 0.6,
  },
  messageContainer: {
    padding: 10,
    flexDirection: 'row' as 'row',
    flex: 0,
  },
  messageTextContainer: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    maxWidth: width * 0.6,
    padding: 10,
    flex: 0,
  },
  map: {
    maxWidth: width * 0.6,
    height: 150,
    marginBottom: 4,
  },
  messageText: {
    ...type.regular,
    color: colors.cosmos,
    opacity:  0.75,
    // fontWeight: '500' as '500',
    // flex: 1,
    textAlign: 'left' as 'left',
  },
}
