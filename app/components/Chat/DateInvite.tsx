import * as React from 'react'
import {
  Text,
  View,
} from 'react-native'

import { colors, type } from '../../../new_foundation'

import FastImage from 'react-native-fast-image'
import { ReduxStore } from '../../../app/types/models'

interface IProps extends ReduxStore.IDate {
  userName: string,
  matchName: string,
  largeMargins?: boolean
}
export default class DateInvite extends React.PureComponent<IProps> {
  public render() {
    return (
      <View
        style={{
          ...style.flexWrapper,
          marginBottom: this.props.largeMargins ? 150 : 24,
        }}
      >
        <Text style={style.heading}>
          {`Congratulations ${this.props.userName}`}
        </Text>
        <FastImage
          style={style.logo}
          resizeMode="contain"
          source={{ uri: this.props.logo }}
        />
        <Text style={style.description} numberOfLines={2}>
          {`You and ${this.props.matchName} are going to\n${this.props.name}`}
        </Text>
        <Text style={style.info}>
          {'You have 7 days to use the\nvalidation code'}
        </Text>
      </View>
    )
  }
}

const style = {
  flexWrapper: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'column' as 'column',
    backgroundColor: colors.transparentWhite,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  heading: {
    ...type.regular,
    color: colors.cosmos,
    textAlign: 'center' as 'center',
  },
  logo: {
    width: 120,
    height: 120,
    margin: 8,
  },
  description: {
    ...type.small,
    color: colors.cosmos,
    textAlign: 'center' as 'center',
    marginBottom: 6,
  },
  info: {
    ...type.small,
    color: colors.shadow,
    textAlign: 'center' as 'center',
  },
}
