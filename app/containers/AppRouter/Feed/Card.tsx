import * as React from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  PanResponder,
  PanResponderGestureState,
  PushNotificationIOS,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { ObjectOf } from '../../../types/helpers'

const { width, height } = Dimensions.get('screen')

import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';
import Section from './CardSection'

import { colors, spacing, type } from '../../../../foundation'

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
  onLeft?: (id: string, candidate: any) => any,
  onRight?: (id: string, candidate: any) => any,
}
interface IState {
  swipeAnimation: Animated.Value,
  scrollEnabled: boolean,
  touchEnabled: boolean,
}
export default class Card extends React.Component<IProps, IState> {
  public getNode: Function | undefined
  constructor(props: IProps) {
    super(props)
  }
  public state = {
    swipeAnimation: new Animated.Value(0),
    scrollEnabled: true,
    touchEnabled: !!this.props.onLeft && !!this.props.onRight,
  }
  public _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      if(gestureState.dx === 0 && gestureState.dy === 0) {
        this.swipeDirection = null
        return false
      }
      if(!this.swipeDirection) { // swipeDirection unset
        if(Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          this.swipeDirection = 'horizontal'
          return true
        }
        this.swipeDirection = 'vertical'
        return false
      }
      return this.swipeDirection === 'horizontal'
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
    }).start(() => {
      return this.props.onRight!(
        this.props._id,
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
    // }).start(() => setTimeout(() => this.animateBack(), 500))
  }
  private animateLeft({ vx, dx }: any) {
    const x = width * 2
    const t = vx > 0.7 ? (x - dx)/vx : 300
    Animated.timing(this.state.swipeAnimation, {
      toValue: width * -2,
      duration: t,
    }).start(() => {
      return this.props.onLeft!(
        this.props._id,
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
    // }).start(() => setTimeout(() => this.animateBack(), 500))
  }
  private animateBack() {
    Animated.timing(this.state.swipeAnimation, {
      toValue: 0,
      duration: 120,
      easing: Easing.elastic(1),
    }).start()
    // this.state.swipeAnimation
  }
  public resetCard() {
    this.state.swipeAnimation.setValue(0)
    this.forceUpdate()
    if(this.scrollView) this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
  }
  private scrollView: any
  private swipeDirection: 'vertical' | 'horizontal' | null = null
  public render() {
    // const images = this.props.profile.images.reverse()
    const imageProps = { style: {
      width: this.props.layout!.width,
      height: this.props.layout!.width,
      marginTop: 1,
    }}
    const transform = this.state.touchEnabled ? [
      { translateX: this.state.swipeAnimation },
      { rotate: this.state.swipeAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '0.1deg'],
      })},
    ] : [{
      scale: this.state.swipeAnimation.interpolate({
        inputRange: [-1*width, 0, width],
        outputRange: [1, 0.9, 1],
        extrapolate: 'clamp',
      }),
    }]
    return (
      <Animated.View
        style={{
          ...style.scrollWrapper,
          transform,
        }}
        pointerEvents={this.state.touchEnabled ? 'auto' : 'none'}
        {...this._panResponder.panHandlers}
      >
        <ScrollView
          style={style.cardWrapper}
          contentContainerStyle={style.cardContainer}
          showsVerticalScrollIndicator={false}
          ref={c => this.scrollView = c}
        >
          <View style={style.header} pointerEvents="none">
            <FastImage
              style={{ width: this.props.layout!.width!, height: this.props.layout!.height! }}
              source={{ uri: this.props.profile.images[0] }}
            />
            <View style={style.headerInfoContainer}>
              <LinearGradient
                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 1)']}
                style={style.headerGradient}
              />
              <Text style={style.headerText}>
                {`${this.props.name}${this.props.age ? ', ' : ''}${this.props.age || ''}`}
              </Text>
            </View>
          </View>
          <Section>
            {this.props.profile.aboutMe}
          </Section>
          {this.props.profile.images[1] && <FastImage {...imageProps} source={{ uri: this.props.profile.images[1] }} />}
          {this.props.profile.images[2] && <FastImage {...imageProps} source={{ uri: this.props.profile.images[2] }} />}
          {this.props.profile.images[3] && <FastImage {...imageProps} source={{ uri: this.props.profile.images[3] }} />}
          {this.props.profile.images[4] && <FastImage {...imageProps} source={{ uri: this.props.profile.images[4] }} />}
          {this.props.profile.images[5] && <FastImage {...imageProps} source={{ uri: this.props.profile.images[5] }} />}
          {/*
            // Bio
            //  - About me
            //  - Quick Facts
            //    - Height
            //    - Starsign
            //    - Activity Level
            // Image 2
            // Question 1
            // Image 3
            // Question 2
            // Image 4
            // Question 3
            // Image 5
            // Instagram
            // Image 6
            // Location + Like/Dislike
          */}
        </ScrollView>
      </Animated.View>
    )
  }
}

const style = {
  scrollWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute' as 'absolute',
    top: 8,
    left: 8,
    shadowColor: colors.lavender,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  cardWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden' as 'hidden',
    backgroundColor: colors.white,
  },
  cardContainer: {
    backgroundColor: '#9372BE',
    minHeight: '100%',
    borderRadius: 16,
    overflow: 'hidden' as 'hidden',
  },
  header: {
    width: '100%',
  },
  headerImage: {
    width: '100%',
  },
  headerInfoContainer: {
    width: '100%',
    height: 100,
    bottom: 0,
    left: 0,
    position: 'absolute' as 'absolute',
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
  },
  headerGradient: {
    width: '100%',
    height: 100,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    position: 'absolute' as 'absolute',
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
  },
  headerText: {
    color: 'rgba(255, 255, 255, 1)',
    ...type.title2,
    marginLeft: 20,
  },
}
