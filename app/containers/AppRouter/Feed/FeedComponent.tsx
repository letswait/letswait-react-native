import React, { ReactNode, RefObject } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Text,
  View,
} from 'react-native'

import { authedApi } from '../../../lib/api'

import WisteriaButton from '../../../components/Buttons/WisteriaButton'
import Card from './Card'

import { ApiResponse } from 'apisauce';
import { ObjectOf } from 'app/types/helpers';
import { isIphoneX } from 'react-native-iphone-x-helper'
import { colors, type } from '../../../../new_foundation'

import LinearGradient from 'react-native-linear-gradient'
import { acceptMatch } from 'app/actions/matches/feed';
import { ReduxStore } from 'app/types/models';

const { width, height } = Dimensions.get('window')

// tslint:disable-next-line: no-var-requires
const noGeolocation = require('../../../assets/ui/ui-geolocation.png')

interface IProps {
  // shouldUpdate: boolean
  geolocation: -1 | 0 | 1 | 2
  user: any,
  currentRoute: any,
  // disablePrerender?: boolean
  locationServicesEnabled: boolean,
  queue: ReduxStore.Match[]
  onGeolocation: () => any
  revealSpinner: (spinner: {
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
  }) => any,
  onScrollUp: () => any
  onScrollDown: () => any
  acceptMatch: (suitorId: ReduxStore.ObjectId) => any
  denyMatch: (suitorId: ReduxStore.ObjectId) => any
}
interface IState {
  feed: any[]
  prerendered: boolean
  activeCard: number
  tintColor: Animated.Value,
  cardSize: {
    width: number | undefined,
    height: number | undefined,
    x: number | undefined,
    y: number | undefined,
  }
  feedMessage: string,
}
export default class FeedComponent extends React.PureComponent<IProps, IState> {
  public state: IState = {
    tintColor: new Animated.Value(0),
    feed: [],
    activeCard: 0,
    prerendered: false,
    cardSize: {
      width: undefined,
      height: undefined,
      x: undefined,
      y: undefined,
    },
    feedMessage: 'Loading Matches...',
  }
  public nextCard: any | null = null
  public currentCard: any | null = null
  constructor(props: IProps) {
    super(props)
  }
  public componentDidMount() {
    if(this.props.geolocation > 0) this.requestFeed()
  }
  public componentDidUpdate(prevProps: IProps) {
    if(this.props.geolocation !== prevProps.geolocation && this.props.geolocation > 0 && prevProps.geolocation !== 1) {
      this.requestFeed()
    }
  }
  public requestFeed() {
    authedApi.get('/api/feed/get-feed').then((res: ApiResponse<any>) => {
      if(!res.ok) {
        this.setState({ feedMessage: 'Could not load Matches' })
      } else {
        this.setState({
          feed: res.data.feed,
          feedMessage: 'No More Matches\n\nPlease Check Again Later',
        })
      }
    })
  }
  // public postAction(candidate: any, action: 'rejected' | 'accepted') {
    // const matchId = this.state.matchMap[userId]
    // this.incrementCard()

    // if(action === 'accepted') {
    //   this.props.acceptMatch(candidate._id)
    // } else {
    //   this.props.denyMatch(candidate)
    // }

    // authedApi.post('/api/matches/post-match', { matchId, action }).then((res: ApiResponse<any>) => {
    //   if(res.ok) {
    //     if(res.data) {
    //       if(!res.data.continue) {
    //         if(res.data.wheel) {
    //           this.props.revealSpinner({
    //             candidate,
    //             match: res.data.match,
    //             user: this.props.user,
    //             wheel: res.data.wheel,
    //           })
    //         }
    //       }
    //       console.log(res.data)
    //     }
    //   }
    // })
  // }
  public acceptMatch = (candidate: ReduxStore.IMatchUser) => this.props.acceptMatch(candidate._id)
  public denyMatch = (candidate: ReduxStore.IMatchUser) => this.props.denyMatch(candidate._id)
  public incrementCard() {
    // Alert.alert(`incrementing card: ${this.state.activeCard} ${this.state.activeCard + 1}`)
    this.setState({ activeCard: this.state.activeCard + 1 })
    if(this.nextCard) this.nextCard.resetCard()
    if(this.currentCard) this.currentCard.resetCard()
  }
  public decrementCard() {
    if(this.state.activeCard) this.setState({ activeCard: this.state.activeCard - 1 })
  }
  public growCard(value: number) {
    if(!!this.nextCard) {
      this.nextCard.state.swipeAnimation.setValue(value)
    }
  }
  public shiftColor(value: number) {
    this.state.tintColor.setValue(value)
  }
  public render() {
    const identityColor = 'rgba(255, 255, 255, 0)'
    const colorHinge = {
      width,
      height,
      position: 'absolute' as 'absolute',
      left: 0,
      top: 0,
      backgroundColor: this.state.tintColor.interpolate({
        inputRange: [-2*width, -1*width, 0, width, 2*width],
        outputRange: [
          identityColor,
          'rgba(235, 124, 49, 0.75)',
          identityColor ,
          'rgba(102, 200, 204, 0.75)',
          identityColor],
        extrapolate: 'clamp',
      }),
    }
    return this.props.geolocation === 1 || this.props.geolocation === -1 ? (
      <View style={style.contentWrapper}>
        <View
          style={{
            ...style.defaultCard,
            opacity: !!this.state.feed && !!this.state.feed[this.state.activeCard + 1] ? 0 : 1,
          }}
          onLayout={event => this.setState({ cardSize: event.nativeEvent.layout })}
        >
          <Text style={style.displayText}>
            {this.state.feedMessage}
          </Text>
        </View>
        {this.state.feed.length > this.state.activeCard + 1 ? (
            <Card
              {...this.state.feed[this.state.activeCard + 1]}
              layout={this.state.cardSize}
              ref={c => this.nextCard = c}
            />
        ) : null}
        <Animated.View style={colorHinge} />
        {this.state.feed.length > this.state.activeCard ? (
          <Card
            {...this.state.feed[this.state.activeCard]}
            ref={(c) => {
              if(c) {
                this.currentCard = c
                c.state.swipeAnimation.addListener(({ value }) => {
                  this.growCard(value)
                  this.shiftColor(value)
                })
              }
            }}
            // ref={this.updateNextCardBound}
            layout={this.state.cardSize}
            // onLeft={(candidate: any) => this.postAction(candidate, 'rejected')}
            onLeft={this.acceptMatch}
            onRight={this.denyMatch}
            // onRight={(candidate: any) => this.postAction(candidate, 'accepted')}
            onScrollUp={() => this.props.onScrollUp()}
            onScrollDown={() => this.props.onScrollDown()}
          />
        ) : null}
      </View>
    ) : (
      <View style={style.noGeolocationWrapper}>
        <Text>
          {false ?
            'Change Location Settings in Settings' :
            'Allow Location to view Nearby Matches'
          }
        </Text>
        <Image source={noGeolocation} />
          <WisteriaButton onPress={() => this.props.onGeolocation()}>
            {false ?
              'Go to Settings' :
              'Turn on Location'
            }
          </WisteriaButton>
      </View>
    )
  }
}

const style = {
  contentWrapper: {
    width,
    height,
    backgroundColor: 'transparent',
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  noGeolocationWrapper: {
    width,
    height,
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  displayText: {
    ...type.title2,
    textAlign: 'center' as 'center',
    color: colors.white,
  },
  defaultCard: {
    width,
    height,
    backgroundColor: colors.seafoam,
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  nextCard: {
    width,
    height,
    position: 'absolute' as 'absolute',
  },
}
