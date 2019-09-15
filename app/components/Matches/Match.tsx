import React from 'react'
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Feather from 'react-native-vector-icons/Feather'
import { colors, type } from '../../../new_foundation'

interface IProps {
  source: string
  name: string
  onPress: () => any
  onAction: (type: 'invite' | 'code') => any
  notification?: boolean
  lastMessage?: string
  dateID?: string
}
interface IState {
  badgeOpacity: Animated.Value
}
export default class Match extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      badgeOpacity: new Animated.Value(this.props.notification ? 1 : 0),
    }
  }
  private onAction() {
    const actionType: 'invite' | 'code' = !!this.props.dateID ? 'code' : 'invite'
    this.props.onAction(actionType)
  }
  public render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.onPress()}
        style={style.wrapper}
      >
        <View style={style.container}>
          <View style={style.imageWrapper}>
            <Image
              source={{ uri: this.props.source }}
              style={style.image}
            />
            <Animated.View style={{ ...style.matchBadge, opacity: this.state.badgeOpacity }}/>
          </View>
          <View style={style.contentWrapper}>
            <Text style={style.title}>
              {this.props.name}
            </Text>
            <Text
              style={style.message}
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              {this.props.lastMessage}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.onAction()}
            style={style.featherWrapper}
          >
            <Feather
              size={32}
              color={colors.capri}
              name={!!this.props.dateID ? 'tag' : 'calendar'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }
}

const style = {
  wrapper: {
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center' as 'center',
    width: '100%',
  },
  container: {
    height: 64,
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
  },
  imageWrapper: {
    height: 64,
    width: 64,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 64/2,
    overflow: 'hidden' as 'hidden',
  },
  matchBadge: {
    position: 'absolute' as 'absolute',
    right: 0,
    top: 0,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: colors.turmeric,
  },
  contentWrapper: {
    marginLeft: 16,
    marginRight: 16,
    flex: 1,
    flexDirection: 'column' as 'column',
  },
  title: {
    ...type.regular,
    width: '100%',
    color: colors.cosmos,
  },
  message: {
    ...type.small,
    width: '100%',
    paddingTop: 6,
    flex: 1,
    color: colors.shadow,
  },
  featherWrapper: {
    height: 48,
    width: 48,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
}
