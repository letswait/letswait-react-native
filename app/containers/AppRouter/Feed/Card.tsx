import * as React from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  PanResponder,
  PanResponderGestureState,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { ObjectOf } from '../../../types/helpers'

const { width, height } = Dimensions.get('screen')

import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

import { colors, type } from '../../../../new_foundation'

import { ifIphoneX } from 'react-native-iphone-x-helper';

import CardSection from './CardSection'
import DynamicListContainer from 'app/components/DynamicListContainer';
import { ReduxStore } from 'app/types/models';

interface IProps {
  _id: string,
  name: string,
  age: number,
  profile: {
    gender: string,
    images: string[],
    food: string[],
  } & any,
  isBot?: boolean,
  botBehavior?: ObjectOf<string>
  layout?: {
    width: number | undefined,
    height: number | undefined,
    x: number | undefined,
    y: number | undefined,
  },
  cardSwipe: any,
  onLeft?: (candidate: ReduxStore.IMatchUser) => any,
  onRight?: (candidate: ReduxStore.IMatchUser) => any,
  onScrollUp?: () => any,
  onScrollDown?: () => any,
}
interface IState {
  swipeAnimation: Animated.Value,
  scrollEnabled: boolean,
  touchEnabled: boolean,
  lastScrollLoc: number,
  scrolling: boolean,
}
export default class Card extends React.PureComponent<IProps, IState> {
  public getNode: Function | undefined
  public recentScrollPosition: number = 0
  private cardSections: ObjectOf<CardSection> = {}
  constructor(props: IProps) {
    super(props)
  }
  public state = {
    swipeAnimation: new Animated.Value(0),
    scrollEnabled: true,
    touchEnabled: !!this.props.onLeft && !!this.props.onRight,
    lastScrollLoc: 0, // all cards start at top
    scrolling: false,
  }
  public _panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      if(Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
        this.swipeDirection = 'horizontal'
        return true
      }
      this.swipeDirection = 'vertical'
      return false
    },
    onPanResponderMove: (evt, gestureState) => {
      if(this.swipeDirection === 'horizontal') {
        this.state.swipeAnimation.setValue(gestureState.dx)
      }
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      this.swipeDirection = null
      if(gestureState.vx > 0.7 || (gestureState.dx > 150 && gestureState.vx > 0.15)) {
        this.animateRight(gestureState)
      } else if (gestureState.vx < -0.7 || (gestureState.dx < -150 && gestureState.vx < 0.15)) {
        this.animateLeft(gestureState)
      } else {
        this.animateBack()
      }
    },
    onPanResponderTerminate: (evt, gestureState) => this.animateBack(),
    onShouldBlockNativeResponder: (evt, gestureState) => false,
  });
  private animateRight({ vx, dx }: any) {
    const x = width * 2
    const t = vx > 0.7 ? (x - dx)/vx : 300
    Animated.timing(this.state.swipeAnimation, {
      toValue: x,
      duration: t,
      useNativeDriver: true,
    }).start(() => {
      return this.props.onRight!(
        {
          _id: this.props._id,
          name: this.props.name,
          age: this.props.age,
          profile: {
            gender: this.props.profile.gender,
            images: this.props.profile.images,
            food: this.props.profile.food,
          },
          ...(this.props.isBot ? { isBot: this.props.isBot } : null),
          ...(this.props.botBehavior ? { botBehavior: this.props.botBehavior } : null),
        },
      )
    })
  }
  private animateLeft({ vx, dx }: any) {
    const x = width * 2
    const t = vx > 0.7 ? (x - dx)/vx : 300
    Animated.timing(this.state.swipeAnimation, {
      toValue: width * -2,
      duration: t,
      useNativeDriver: true,
    }).start(() => {
      return this.props.onLeft!(
        {
          _id: this.props._id,
          name: this.props.name,
          age: this.props.age,
          profile: {
            gender: this.props.profile.gender,
            images: this.props.profile.images,
            food: this.props.profile.food,
          },
          ...(this.props.isBot ? { isBot: this.props.isBot } : null),
          ...(this.props.botBehavior ? { botBehavior: this.props.botBehavior } : null),
        },
      )
    })
  }
  private animateBack() {
    Animated.timing(this.state.swipeAnimation, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start()
  }
  public resetCard() {
    this.state.swipeAnimation.setValue(0)
    this.forceUpdate()
    if(this.scrollView) {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
    }
  }
  private scrollView: ScrollView | null = null
  private swipeDirection: 'vertical' | 'horizontal' | null = null
  public render() {
    const transform = this.state.touchEnabled ? [
      { translateX: this.state.swipeAnimation },
      { rotate: this.state.swipeAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '0.05deg'],
      })},
    ] : [{
      scale: this.state.swipeAnimation.interpolate({
        inputRange: [-1*width, 0, width],
        outputRange: [1, 0.9, 1],
        extrapolate: 'clamp',
      }),
    }]
    const opacity = this.state.touchEnabled ?
      1 :
      this.state.swipeAnimation.interpolate({
        inputRange: [-1*width, 0, width],
        outputRange: [1, 0, 1],
        extrapolate: 'clamp',
      })
    const titleContainer = {
      ...style.titleContainer,
      backgroundColor: this.props.profile.gender === 'male' ? colors.coralBlue : colors.coralPink,
    }
    return (
      <Animated.View
        style={{
          ...style.scrollWrapper,
          transform,
          opacity,
        }}
        pointerEvents={this.state.touchEnabled ? 'auto' : 'none'}
        {...this._panResponder.panHandlers}
      >
        <ScrollView
          style={style.cardWrapper}
          contentContainerStyle={style.cardContainer}
          bounces={true}
          bouncesZoom
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={50}
          // decelerationRate="fast"
          ref={(c: ScrollView) => {
            this.scrollView = c
          }}
          // tslint:disable-next-line: max-line-length
          onScrollBeginDrag={event => this.setState({ lastScrollLoc: event.nativeEvent.contentOffset.y, scrolling: true })}
          onScrollEndDrag={event => this.setState({ scrolling: false })}
          onScroll={(event) => {
            const diff = event.nativeEvent.contentOffset.y - this.state.lastScrollLoc
            const v = event.nativeEvent.contentOffset.y - this.recentScrollPosition
            this.recentScrollPosition = event.nativeEvent.contentOffset.y + 0

            const existingSections = Object.keys(this.cardSections).length
            let foundItems = v > 0 ? existingSections : 0
            for(const r in this.cardSections) {
              if(this.cardSections[r]) {
                const decay = foundItems * foundItems/existingSections
                this.cardSections[r].onScroll(
                  foundItems * v ,
                  10 * decay,
                )
                v > 0 ? foundItems++ : foundItems--
              }
            }

            if(diff > 100 || v > 30) {
              if(this.state.scrolling) this.props.onScrollDown!()
            } else if(diff < -100 || v < -30) {
              if(this.state.scrolling) this.props.onScrollUp!()
            } else {
              return
            }

            if(Math.abs(diff) > 100) {
              this.setState({ lastScrollLoc: event.nativeEvent.contentOffset.y })
            }
          }}
        >
          <CardSection
            source={{ uri: this.props.profile.images[0] }}
            customHeight={height - ifIphoneX(84, 64) - 76}
            ref={c => c ? this.cardSections.section1 = c : null}
          >
            <View style={titleContainer}>
              <Text style={style.titleText}>
                {`${this.props.name}${this.props.age ? ', ' : ''}${this.props.age || ''}`.toUpperCase()}
              </Text>
            </View>
            <View style={style.profileBioWrapper}>
              <Text style={style.profileBioText}>{this.props.profile.aboutMe}</Text>
            </View>
          </CardSection>
          <CardSection
            ref={c => c ? this.cardSections.section2 = c : null}
            source={{ uri: this.props.profile.images[1] }}
          />
          <CardSection
            ref={c => c ? this.cardSections.section3 = c : null}
            source={{ uri: this.props.profile.images[2] }}
          />
          {this.props.profile.images[3] && <CardSection source={{ uri: this.props.profile.images[3] }}/>}
          {this.props.profile.images[4] && <CardSection source={{ uri: this.props.profile.images[4] }}/>}
          {this.props.profile.images[5] && <CardSection source={{ uri: this.props.profile.images[5] }}/>}
        </ScrollView>

        {/* <View style={style.stickyHeaderWrapper}>
          <View
            style={{
              ...style.stickyHeader,
              backgroundColor: this.props.profile.gender === 'male' ? colors.coralBlue : colors.coralPink,
            }}
          >
            <Text style={style.stickyText}>
              {`${this.props.name}${this.props.age ? ', ' : ''}${this.props.age || ''}`.toUpperCase()}
            </Text>
          </View>
        </View> */}
      </Animated.View>
    )
  }
}

const style = {
  backgroundSubtleGradient: {
    height,
    width,
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
  },
  scrollWrapper: {
    width,
    height,
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    shadowColor: colors.shadow,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  cardWrapper: {
    width,
    height,
    backgroundColor: colors.transparentWhite,
    overflow: 'visible' as 'visible',
  },
  cardContainer: {
    backgroundColor: colors.transparentWhite,
    minHeight: height,
  },
  stickyHeaderWrapper: {
    width,
    height: ifIphoneX(92, 68),
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'flex-end' as 'flex-end',
    alignItems: 'center' as 'center',
    backgroundColor: colors.white,
  },
  stickyHeader: {
    height: 48,
    paddingTop: 3,
    width: width - 24,
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'center' as 'center',
    alignItems: 'stretch' as 'stretch',
    opacity: 0.9,
    paddingLeft: 24,
    paddingRight: 24,
  },
  stickyText: {
    flex: 1,
    ...type.title2,
    color: colors.white,
  },
  profileBioWrapper: {
    minHeight: 64,
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  profileBioText: {
    ...type.regular,
    color: colors.cosmos,
    width: width - 72,
  },
  titleContainer: {
    height: 48,
    paddingTop: 3,
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    opacity: 0.9,
  },
  titleText: {
    ...type.title2,
    color: colors.white,
    marginLeft: 24,
    marginRight: 24,
  },
}
