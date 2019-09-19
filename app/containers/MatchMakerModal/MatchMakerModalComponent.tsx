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

import Date from '../../components/DateInvite/Date'
import Spinner from '../../components/DateInvite/Spinner'

import Feather from 'react-native-vector-icons/Feather'

import { colors, type } from '../../../new_foundation'

import { authedApi } from '../../lib/api';

import { ApiResponse } from 'apisauce';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window')

interface IProps {
  dismiss: () => any
  pushChat: (matchId: any, candidate: any) => any,
  spinner?: {
    match: any,
    user: any,
    candidate: any,
    wheel: {
      segments: Array<{
        logo: string,
        name: string,
        venueId?: any,
        campaignId?: any,
        priceLevel?: 0 | 1 | 2 | 3 | 4,
        message?: string,
        code?: string,
      }>,
      chosenSegment: number,
    },
  }
}
interface IState {
  paging: 0 | 1
  choseVenue: boolean
  buttonsRevealed: boolean
  result: 'later' | 'accept' | undefined
  dismissingModal: boolean
}
export default class MatchMakerModal extends React.PureComponent<IProps, IState> {
  public state: IState = {
    paging: 0,
    choseVenue: false,
    buttonsRevealed: false,
    result: undefined,
    dismissingModal: false,
  }
  constructor(props: IProps) {
    super(props)
  }
  public scrollView: ScrollView | null = null
  public revealButtons() {
    this.setState({
      buttonsRevealed: true,
    })
  }
  public pageForward() {
    this.setState({ paging: 1 })
    this.scrollView!.scrollTo({ x: width, y: 0, animated: true })
  }
  public sendMessage() {
    this.setState({ dismissingModal: true })
    authedApi.post('/api/matches/post-wheel', {
      wheel: this.props.spinner!.wheel,
      message: '',
      matchId: this.props.spinner!.match._id,
    }).then((res: ApiResponse<any>) => {
      if(res.ok) {
        const match = this.props.spinner!.match
        match.chat = match.chat.concat([{
          message: {
            text: '',
          },
        }])
        this.props.pushChat(match, res.data!.candidate)
        this.props.dismiss()
      }
    })
  }
  public proxyResponse() {
    setTimeout(
      () => {
        this.setState({ choseVenue: true })
      },
      500)
  }
  public render() {
    console.log(this.props.spinner)
    if(this.props.spinner) {
      const { user, candidate, wheel } = this.props.spinner
      const pageStyle = {
        width,
        height,
        flexDirection: 'column' as 'column',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
      }
      return (
        <ScrollView
          scrollEnabled={false}
          pagingEnabled={true}
          style={{
            width,
            height,
            backgroundColor: colors.seafoam,
          }}
          ref={c => this.scrollView = c}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={pageStyle}>
            <Text
              style={{
                ...type.title1,
                textAlign: 'center' as 'center',
                marginTop: 29,
              }}
            >
              {'SPIN FOR A DATE'}
            </Text>
            <Date
              sources={[user.profile.images[0], candidate.profile.images[0]]}
            />
            <Spinner
              onSpin={() => this.proxyResponse()}
              onFinish={() => this.pageForward()}
              segments={wheel.segments as any}
              result={this.state.choseVenue ? wheel.chosenSegment as any : undefined}
            />
            <Text
              style={{
                ...type.title1,
                textAlign: 'center' as 'center',
                marginTop: 29,
              }}
            >
              {'SPIN FOR A DATE'}
            </Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => this.sendMessage()}
          >
            <View style={pageStyle}>
              <Text
                style={{
                  ...type.title1,
                  textAlign: 'center' as 'center',
                  marginBottom: 12,
                  maxWidth: 275,
                }}
              >
                {`DON'T WAIT\n${this.props.spinner.user.name.toUpperCase()}!`}
              </Text>
              <Text
                style={{
                  ...type.regular,
                  textAlign: 'center' as 'center',
                  marginBottom: 16,
                  maxWidth: 275,
                }}
              >
                {`Check your messages for details.\nMessage ${this.props.spinner.candidate.name} and set your date at:`}
              </Text>
              <FastImage
                source={{ uri: this.props.spinner.wheel.segments[this.props.spinner.wheel.chosenSegment].logo }}
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
                  {this.props.spinner.wheel.segments[this.props.spinner.wheel.chosenSegment].code}
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
        </ScrollView>
      )
    }
    return null
  }
}

const style = {

}
