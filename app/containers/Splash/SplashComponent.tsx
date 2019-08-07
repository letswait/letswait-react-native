import React from 'react'
import {
  Image,
  Text,
  View,
} from 'react-native'

import { colors, spacing, type } from '../../../foundation'

interface IProps {
  authenticate: () => any
}
export default class SplashScreen extends React.Component<IProps,{}> {
  public componentDidMount() {
    // this.props.authenticate()
  }
  public render() {
    return (
      <View style={style.screen}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={style.logo}
        />
        <View style={style.titleLine}>
          <Text style={style.smallType}>Lets</Text>
          <Text style={style.largeType}>Wait</Text>
        </View>
      </View>
    )
  }
}

const style = {
  screen: {
    backgroundColor: colors.wisteria,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    width: '100%' as '100%',
    height: '100%' as '100%',
  },
  logo: {
    width: 100,
    height: 100,
  },
  titleLine: {
    paddingTop: spacing.tiny,
    flexDirection: 'row' as 'row',
  },
  smallType: {
    ...type.title2,
    color: colors.white,
    fontWeight: '400' as '400',
  },
  largeType: {
    ...type.title2,
    fontWeight: '600' as '600',
    color: colors.white,
  },
}
