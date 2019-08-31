import React from 'react'
import {
  Animated,
  Easing,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import FastImage from 'react-native-fast-image'
import MapView, { LatLng, Marker } from 'react-native-maps'

import LeftMessageContainer from './LeftMessageContainer'
import RightMesssageContainer from './RightMessageContainer'

import { colors, spacing, type } from '../../../foundation';
import { ReduxStore } from '../../types/models'

interface IProps extends ReduxStore.IChat {
  direction: 'left' | 'right'
  key?: number | string,
}
// interface IState {

// }
export default class Message extends React.PureComponent<IProps> {
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
    return this.props.direction === 'left' ? (
      <LeftMessageContainer>
        {this.renderMessage()}
      </LeftMessageContainer>
    ) : (
      <RightMesssageContainer>
        {this.renderMessage()}
      </RightMesssageContainer>
    )
  }
}

const style = {
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
    ...type.small,
    color: 'white',
    fontWeight: '500' as '500',
    flex: 1,
    textAlign: 'left' as 'left',
  },
}
