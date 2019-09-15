import React from 'react'
import {
  Image,
  Text,
  View,
} from 'react-native'

import { colors, type } from '../../../new_foundation'

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
          source={{ uri: 'logo' }}
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
    backgroundColor: colors.capri,
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
    paddingTop: 8,
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
