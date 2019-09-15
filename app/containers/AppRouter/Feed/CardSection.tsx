import * as React from 'react'
import {
  Text,
  View,
} from 'react-native'

import { colors, type } from '../../../../new_foundation'

import { ifIphoneX } from 'react-native-iphone-x-helper'

interface IProps {
  title?: string,
  children: React.ReactNode,
}
export default class CardSection extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <View style={style.sectionContainer}>
        {this.props.title && <Text style={style.title}>{this.props.title}</Text>}
        {typeof this.props.children === 'string' ?
          <Text style={style.text}>{this.props.children}</Text> :
          this.props.children
        }
      </View>
    )
  }
}

const style = {
  sectionContainer: {
    width: '100%',
    padding: 24,
    flexDirection: 'column' as 'column',
    alignItems: 'flex-start' as 'flex-start',
    justifyContent: 'center' as 'center',
    minHeight: ifIphoneX(200, 150),
  },
  title: {
    ...type.regular,
    color: colors.cosmos,
    marginBottom: 8,
    marginTop: 16,
  },
  text: {
    ...type.regular,
    color: colors.cosmos,
    marginBottom: 16,
  },
}
