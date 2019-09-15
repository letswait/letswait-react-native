import * as React from 'react'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import Feather from 'react-native-vector-icons/Feather'

import { colors, type } from '../../../new_foundation'

import moment from 'moment'
import FastImage from 'react-native-fast-image';
import { ReduxStore } from '../../types/models';

const { width, height } = Dimensions.get('window')

interface IProps {
  dismiss: () => any
  match?: ReduxStore.Match
  name: string
}
interface IState {
  dismissingModal: boolean
}
export default class MatchMakerModal extends React.PureComponent<IProps, IState> {
  public state: IState = {
    dismissingModal: false,
  }
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    if(this.props.match) {
      let venueLogo = ''
      let code = ''
      for(let i = this.props.match.dates.length; i--;) {
        if(!this.props.match.dates[i].consumed && moment(this.props.match.dates[i].expiresOn).isAfter(moment())) {
          venueLogo = this.props.match.dates[i].logo
          code = this.props.match.dates[i].code
          break;
        }
      }
      const pageStyle = {
        width,
        height,
        backgroundColor: colors.seafoam,
        flexDirection: 'column' as 'column',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
      }
      return (
        <TouchableWithoutFeedback
          onPress={() => this.props.dismiss()}
        >
          <View style={pageStyle}>
              <Text
                style={{
                  ...type.title1,
                  textAlign: 'center' as 'center',
                  maxWidth: 275,
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                CONGRATS
              </Text>
              <Text
                style={{
                  ...type.title1,
                  textAlign: 'center' as 'center',
                  marginBottom: 12,
                  textTransform: 'uppercase' as 'uppercase',
                  maxWidth: 275,
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {`${this.props.name}!`}
              </Text>
              <Text
                style={{
                  ...type.regular,
                  textAlign: 'center' as 'center',
                  marginBottom: 16,
                  maxWidth: 275,
                }}
              >
                {`Check your messages for details.\n Message ${this.props.match.userProfiles[0].name} and set your date at:`}
              </Text>
              <FastImage
                source={{ uri: venueLogo }}
                style={{
                  width: 225,
                  height: 225,
                }}
                resizeMode="contain"
              />
              <View
                style={{
                  width: 275,
                  height: 67,
                  maxWidth: '90%',
                  backgroundColor: colors.white,
                  borderRadius: 9,
                  flexDirection: 'row' as 'row',
                  justifyContent: 'center' as 'center',
                  alignItems: 'center' as 'center',
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    ...type.input,
                    color: colors.cosmos,
                    letterSpacing: 1.5,
                  }}
                >
                  {code}
                </Text>
              </View>
              <Text
                style={{
                  ...type.regular,
                  textAlign: 'center' as 'center',
                  marginTop: 12,
                  maxWidth: 275,
                }}
              >
                {'Present validation code\ntogether to receive the discount.'}
              </Text>

              {!this.state.dismissingModal &&
                <Feather name="crosshair" size={18} color={colors.cloud} style={{ marginTop: 40 }} />
              }
              {!this.state.dismissingModal &&
                <Text
                  style={{
                    ...type.small,
                    textAlign: 'center' as 'center',
                    marginTop: 4,
                    maxWidth: 275,
                    color:  colors.cloud,
                  }}
                >
                  Tap Anywhere to Dismiss
                </Text>
              }
              {this.state.dismissingModal &&
                <ActivityIndicator
                  size={18}
                  style={{ marginTop: 48 }}
                  color={colors.cloud}
                />
              }
            </View>
        </TouchableWithoutFeedback>
      )
    }
    return null
  }
}
