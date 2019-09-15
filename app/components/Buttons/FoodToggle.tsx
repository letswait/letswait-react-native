import React from 'react'
import { Image, Text } from 'react-native'
import BaseButton from './BaseButton'

import { Food } from '../../types/helpers'

import { colors } from '../../../new_foundation'

interface IProps {
  onPress: () => any
  active?: boolean
  image: Food
  label: string
  style?: any
}
export default class ToggleButton extends React.PureComponent<IProps,{}> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <BaseButton
        toggleable={true}
        onPress={() => this.props.onPress()}
        style={{ ...style.buttonDefault, ...this.props.style }}
        disabledStyle={{ ...style.buttonDisabled, ...this.props.style }}
        disabled={!this.props.active || false}
        altChildren
      >
        <Text
          style={this.props.active ?
            style.label :
            style.disabledLabel
          }
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {this.props.label}
        </Text>
        <Image
          source={foodImages[this.props.image]}
          width={48}
          height={48}
          resizeMode={'contain' as 'contain'}
        />
      </BaseButton>
    )
  }
}

const foodImages = {
  alcohol: require('../../assets/images/food_alcohol.png'),
  burger: require('../../assets/images/food_burger.png'),
  chinese: require('../../assets/images/food_chinese.png'),
  fusion: require('../../assets/images/food_fusion.png'),
  healthy: require('../../assets/images/food_healthy.png'),
  italian: require('../../assets/images/food_italian.png'),
  pizza: require('../../assets/images/food_pizza.png'),
  seafood: require('../../assets/images/food_seafood.png'),
  steakhouse: require('../../assets/images/food_steakhouse.png'),
  sushi: require('../../assets/images/food_sushi.png'),
  mexican: require('../../assets/images/food_mexican.png'),
  thai: require('../../assets/images/food_thai.png'),
}

const style = {
  buttonDefault: {
    container: {
      backgroundColor: colors.white,
      borderColor: 'transparent',
      width: 82,
      height: 82,
      flexDirection: 'column-reverse' as 'column-reverse',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
    },
    label: {},
  },
  buttonDisabled: {
    container: {
      backgroundColor: colors.shadow,
      alignItems: 'center' as 'center',
      width: 82,
      height: 82,
      flexDirection: 'column-reverse' as 'column-reverse',
    },
    label: {},
  },
  label: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700' as '700',
    color: colors.cosmos,
    margin: 0,
    marginTop: 7,
    padding: 0,
  },
  disabledLabel: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700' as '700',
    color: colors.white,
    margin: 0,
    marginTop: 7,
    padding: 0,
  },
  image: {
    width: 48,
    height: 48,
  },
}
