import * as React from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'

import Date from '../../components/DateInvite/Date'
import Spinner from '../../components/DateInvite/Spinner'
import SpinnerButtonGroup from '../../components/DateInvite/SpinnerButtonGroup'
import { SpinnerInfo } from '../../types/spinner';

import { colors, spacing, type } from '../../../foundation'

import WisteriaButton from '../../components/Buttons/WisteriaButton';
import { authedApi } from '../../lib/api';

import { ApiResponse } from 'apisauce';

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
  msg: string
  tip: string
}
export default class MatchMakerModal extends React.PureComponent<IProps, IState> {
  public state: IState = {
    paging: 0,
    choseVenue: false,
    buttonsRevealed: false,
    result: undefined,
    msg: '',
    tip: 'Spin the wheel to invite them on a date!',
  }
  constructor(props: IProps) {
    super(props)
  }
  public scrollView: ScrollView | null = null
  public revealButtons() {
    this.setState({
      buttonsRevealed: true,
      tip: `How does ${this.props.spinner!.wheel.segments[this.props.spinner!.wheel.chosenSegment].name} sound?`,
    })
  }
  public pageForward() {
    this.setState({ paging: 1, tip: 'Say Hi!' })
    this.scrollView!.scrollTo({ x: width, y: 0, animated: true })
  }
  public sendMessage() {
    authedApi.post('/api/matches/post-wheel', {
      wheel: this.props.spinner!.wheel,
      message: this.state.msg,
      matchId: this.props.spinner!.match._id,
    }).then((res: ApiResponse<any>) => {
      if(res.ok) {
        const match = this.props.spinner!.match
        match.chat = match.chat.concat([{
          message: {
            text: this.state.msg,
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
      return (
        <KeyboardAvoidingView
          behavior={'padding'}
          style={style.container}
        >
          <Text style={style.congrats}>
            {`You Matched with ${candidate.name}!`}
          </Text>
          <Date
            sources={[user.profile.images[0], candidate.profile.images[0]]}
          />
          <Text style={style.tipText}>
            {this.state.tip}
          </Text>
          <ScrollView
            scrollEnabled={false}
            pagingEnabled={true}
            style={style.scrollView}
            contentContainerStyle={{ flex: 0, height: 400 }}
            ref={c => this.scrollView = c}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <View style={style.pageWrapper}>
              <Spinner
                onSpin={() => this.proxyResponse()}
                onFinish={() => this.revealButtons()}
                segments={wheel.segments as any}
                result={this.state.choseVenue ? wheel.chosenSegment as any : undefined}
              />
              <View
                pointerEvents={this.state.buttonsRevealed ? 'auto' : 'none'}
                style={{ opacity: this.state.buttonsRevealed ? 1 : 0, marginTop: spacing.base }}
              >
                <SpinnerButtonGroup
                  onDeny={() => this.props.dismiss()}
                  onAccept={() => this.pageForward()}
                />
              </View>
            </View>
            <View style={style.pageWrapper}>
              <TextInput
                style={style.messageInput}
                onChangeText={msg => this.setState({ msg })}
                value={this.state.msg}
                multiline
              />
              <WisteriaButton onPress={() => this.sendMessage()}>
                {`Invite ${this.props.spinner!.candidate.name}`}
              </WisteriaButton>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )
    }
    return null
  }
}

const style = {
  container: {
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  congrats: {
    width,
    ...type.title3,
    textAlign: 'center' as 'center',
    color: colors.white,
    marginTop: spacing.large,
    marginBottom: spacing.small * 2,
    flex: 0,
  },
  tipText: {
    width,
    ...type.regular,
    textAlign: 'center' as 'center',
    color: colors.white,
    marginTop: spacing.small*2,
    marginBottom: spacing.small*2,
    flex: 0,
  },
  scrollView: {
    width,
    backgroundColor: colors.transparent,
    flexGrow: 0,
    height: 400,
  },
  messageInput: {
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    color: colors.cosmos,
    ...type.regular,
    width: 300,
  },
  pageWrapper: {
    width,
    display: 'flex' as 'flex',
    flex: 0,
    height: 400,
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    backgroundColor: colors.transparent,
  },

}
