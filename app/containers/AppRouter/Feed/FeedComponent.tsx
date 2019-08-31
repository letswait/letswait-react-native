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
import { colors, spacing, type } from '../../../../foundation'
const { width, height } = Dimensions.get('screen')

// tslint:disable-next-line: no-var-requires
const noGeolocation = require('../../../assets/ui/ui-geolocation.png')

interface IProps {
  shouldUpdate: boolean
  geolocation: -1 | 0 | 1 | 2
  user: any,
  currentRoute: any,
  disablePrerender?: boolean
  locationServicesEnabled: boolean,
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
}
interface IState {
  feed: any[]
  prerendered: boolean
  activeCard: number
  matchMap?: ObjectOf<string>,
  cardSize: {
    width: number | undefined,
    height: number | undefined,
    x: number | undefined,
    y: number | undefined,
  }
  feedMessage: string,
}
export default class FeedComponent extends React.Component<IProps, IState> {
  public state: IState = {
    feed: [],
    activeCard: 0,
    prerendered: false,
    matchMap: undefined,
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
    if(this.props.geolocation > 0 && prevProps.geolocation !== 1) {
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
          matchMap: res.data.matchMap,
          feedMessage: 'No More Matches\n\nPlease Check Again Later',
        })
      }
    })
  }
  public shouldComponentUpdate() {
    if(!this.state.prerendered && !this.props.disablePrerender) {
      this.setState({ prerendered: true })
      return true
    }
    return !!this.props.shouldUpdate
  }
  public postAction(candidate: any, userId: string, action: 'rejected' | 'accepted') {
    if(!this.state.matchMap) return
    const matchId = this.state.matchMap[userId]
    this.incrementCard()
    authedApi.post('/api/matches/post-match', { matchId, action }).then((res: ApiResponse<any>) => {
      if(res.ok) {
        if(res.data) {
          if(!res.data.continue) {
            if(res.data.wheel) {
              this.props.revealSpinner({
                candidate,
                match: res.data.match,
                user: this.props.user,
                wheel: res.data.wheel,
              })
            }
          }
          console.log(res.data)
        }
      }
    })
  }
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
  public render() {
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
        {this.state.feed.length > this.state.activeCard ? (
          <Card
            {...this.state.feed[this.state.activeCard]}
            ref={(c) => {
              if(c) {
                this.currentCard = c
                c.state.swipeAnimation.addListener(({ value }) => this.growCard(value))
              }
            }}
            // ref={this.updateNextCardBound}
            layout={this.state.cardSize}
            onLeft={(id: string, candidate: any) => this.postAction(candidate, id, 'rejected')}
            onRight={(id: string, candidate: any) => this.postAction(candidate, id, 'accepted')}
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
    padding: 8,
    backgroundColor: colors.transparent,
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
    ...type.title3,
    textAlign: 'center' as 'center',
    lineHeight: 32,
    color: 'rgba(134, 57, 182, 0.5)',
  },
  defaultCard: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 3,
    borderStyle:'dashed' as 'dashed',
    borderColor: 'rgba(176, 118, 215, 0.4)',
    backgroundColor: colors.transparent,
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  nextCard: {
    width: '100%',
    height: '100%',
    position: 'absolute' as 'absolute',
  },
}
