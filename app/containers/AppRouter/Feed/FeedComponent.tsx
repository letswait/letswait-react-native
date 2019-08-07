import React from 'react'
import {
  Animated,
  Dimensions,
  Image,
  Text,
  View,
} from 'react-native'

import WisteriaButton from '../../../components/Buttons/WisteriaButton'

import { isIphoneX } from 'react-native-iphone-x-helper'
import { colors, spacing, type } from '../../../../foundation'
const { width, height } = Dimensions.get('screen')

// tslint:disable-next-line: no-var-requires
const noGeolocation = require('../../../assets/ui/ui-geolocation.png')

interface IProps {
  shouldUpdate: boolean
  geolocation: 0 | 1 | 2
  onGeolocation: () => any
}
interface IState {

}
export default class FeedComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }
  public shouldComponentUpdate() {
    return this.props.shouldUpdate
  }
  public render() {
    return this.props.geolocation === 1 ? (
      <View style={style.contentWrapper}>
        <Text style={style.displayText}>
          Matching Disabled
        </Text>
      </View>
    ) : (
      <View style={style.noGeolocationWrapper}>
        <Text>{(() => {
          switch(this.props.geolocation) {
            // case 'restricted': return 'Geolocation not allowed by administrators'
            case 2: return 'Change Location Settings in Settings'
            default: return 'Allow Location to view Nearby Matches'
          }
        })()}</Text>
        <Image source={noGeolocation} />
          <WisteriaButton onPress={() => this.props.onGeolocation()}>
            {this.props.geolocation === 2 ?
              'Go to Settings' :
              'Turn on Location'
            }
          </WisteriaButton>
      </View>
    )
  }
}

const style = {
  screenContainer: {
    width,
    height,
    padding: 16,
    paddingTop: isIphoneX ? 136 : 112,
    paddingBottom: isIphoneX ? 50 : 30,
    backgroundColor: colors.transparent,
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  contentWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 0,
    borderColor: colors.transparent,
    backgroundColor: colors.wisteria,
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  noGeolocationWrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  displayText: {
    ...type.title2,
    color: colors.white,
  },
}
