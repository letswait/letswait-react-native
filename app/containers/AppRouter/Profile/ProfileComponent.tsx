import React from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'

import WisteriaButton from '../../../components/Buttons/WisteriaButton'

import moment from 'moment'

import LinearGradient from 'react-native-linear-gradient'

import { photoUpload } from '../../../lib/api'

import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { colors, spacing, type } from '../../../../foundation'
import SelectPhoto from '../../../components/Buttons/SelectPhoto'
import FeatherButton from '../../../components/Camera/CameraButton'
import { IMediaReference } from '../../../types/photos'
const { width, height } = Dimensions.get('screen')

/**
 * @todo this needs to be cleaned up and turned into its own component. but for now it works, but its disorganized
 * @todo I need to size this to other screens, it should work for most, but shorter screens need an option
 */

const bubbleCanvasWidth = Math.max(width - 32, 320)
const bubbleCanvasCenter = bubbleCanvasWidth / 2
const bubbleCanvasSpaceBetween = bubbleCanvasWidth/3
const startY = isIphoneX ? 184 : 160
const startX = (width - bubbleCanvasWidth) / 2

const cols = [
  startX + bubbleCanvasSpaceBetween,
  startX + bubbleCanvasSpaceBetween * 2,
  startX + bubbleCanvasSpaceBetween * 3,
]
const rows = [
  startY + bubbleCanvasCenter - 8 - (85 / 2),
  startY + bubbleCanvasCenter + 8 + (85 / 2),
]
const startStateCoords = [
  { x: cols[0], y: rows[0], w: 85 },
  { x: cols[1], y: rows[0], w: 85 },
  { x: cols[2], y: rows[0], w: 85 },
  { x: cols[0], y: rows[1], w: 85 },
  { x: cols[1], y: rows[1], w: 85 },
  { x: cols[2], y: rows[1], w: 85 },
]
const tempEndCoords = [
  { x: 0.50, y: 0.50, s: 0.35 },
  { x: 0.72, y: 0.23, s: 0.47 },
  { x: 0.52, y: 0.43, s: 0.69 },
  { x: 0.19, y: 0.80, s: 0.25 },
  { x: 0.21, y: 0.24, s: 0.26 },
  { x: 0.79, y: 0.68, s: 0.25 },
]
const endCoords = tempEndCoords.map((loc, i, arr) => {
  let x = (startX * 4 + 4) + (bubbleCanvasWidth * loc.x)
  x = x - startStateCoords[i].x
  let y = startY + bubbleCanvasWidth * loc.y
  y -= startStateCoords[i].y
  let s = bubbleCanvasWidth * loc.s
  s = s / 85
  return { x, y, s }
})
const bubbleColors = [
  colors.transparent,
  '#D4ACF5',
  '#CFA6F1',
  '#CF9AFB',
  '#CF9AFB',
  '#CFA6F1',
]

const maxScroll = 350
const offsetY = 240

interface IProps {
  shouldUpdate: boolean
  user: any
  currentRoute: string
  disablePrerender?: boolean
  changeSearchSettings: (changes: any) => any
}
interface IState {
  scrollY: Animated.Value
  prerendered: boolean
  transitionPrepared: boolean,
  bubbleOffsets: Array<{
    x: number,
    y: number,
    s: number,
  }>
  hideEditButton: boolean
  disableCanvas: boolean
  beenScrolled: boolean
  scrollEnabled: boolean
  searchRadius: number,
  searchAgeRange: [number, number],
  photos: Array<IMediaReference | undefined>
  photoProgress: number[]
  profileFood: string[]
  profileAboutMe: string
  profileQuestions: Array<[string, string]>
}
export default class ProfileComponent extends React.Component<IProps, IState> {
  private scrollView: any
  public state: IState = {
    scrollY: new Animated.Value(0),
    prerendered: false,
    bubbleOffsets: [],
    transitionPrepared: true,
    hideEditButton: true,
    disableCanvas: false,
    beenScrolled: false,
    scrollEnabled: true,
    searchRadius: this.props.user && this.props.user.searchSettings ?
      this.props.user.searchSettings.radius || 50 : 50,
    searchAgeRange: this.props.user && this.props.user.searchSettings ?
      this.props.user.searchSettings.ageRange || [18, 25] : [18, 25],
    photos: this.props.user && this.props.user.profile && this.props.user.profile.images ?
      new Array(6).fill(undefined).map((val, i, arr) => {
        return this.props.user.profile.images[i] ? { uri: this.props.user.profile.images[i] } : undefined
      }) :
      new Array(6).fill(undefined),
    photoProgress: new Array(6).fill(0),
    profileFood: this.props.user && this.props.user.profile ?
      this.props.user.profile.food : [],
    profileAboutMe: this.props.user && this.props.user.profile ?
      this.props.user.profile.aboutMe : null,
    profileQuestions: this.props.user && this.props.user.profile && this.props.user.profile.questions ?
      this.props.user.profile.questions : [],
  }
  constructor(props: IProps) {
    super(props)
    // Animated.loop
    this.state.scrollY.addListener(({ value }) => {
      if(
        value < maxScroll &&
        (
          (!this.state.hideEditButton && value < maxScroll - 10) ||
          (this.state.hideEditButton && value >= maxScroll - 10) ||
          (
            value < offsetY + 10 &&
            (!this.state.disableCanvas && value >= offsetY) ||
            (this.state.disableCanvas && value < offsetY) ||
            (
              value < 20 &&
              (this.state.beenScrolled && value < 10) ||
              (!this.state.beenScrolled && value >= 10)
            )
          )
        )
      ) {
        this.setState(
          {
            hideEditButton: value < maxScroll - 10,
            disableCanvas: value >= offsetY,
            beenScrolled: value > 10,
          },
          () => console.log('Lisening!', this.state.disableCanvas, this.state.hideEditButton),
        )
      }
    })
  }
  public commitChanges() {

  }
  public shouldComponentUpdate() {
    if(!this.state.prerendered && !this.props.disablePrerender) {
      this.setState({ prerendered: true })
      return true
    }
    if(this.props.shouldUpdate) {
      return true
    }
    if(this.props.currentRoute.indexOf('/app/profile') === -1 && this.state.beenScrolled) {
      this.scrollView.getNode().scrollTo({ y: 0, animated: false })
      return true
    }
    return false
  }
  public createTransition(bubble: number) {
    const inputRange = [15, maxScroll]
    const translateX = this.state.scrollY.interpolate({
      inputRange,
      outputRange: [endCoords[bubble].x, 0],
      extrapolate: 'clamp',
      // easing: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    })
    const overscrollY = endCoords[bubble].y >= 0 ?
      endCoords[bubble].y - (endCoords[bubble].y * 0.3) :
      endCoords[bubble].y + (endCoords[bubble].y * 0.3)
    const translateY = this.state.scrollY.interpolate({
      inputRange: [15, maxScroll],
      outputRange: [endCoords[bubble].y, offsetY],
      extrapolate: 'clamp',
      // easing: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    })
    const scale = this.state.scrollY.interpolate({
      inputRange,
      outputRange: [endCoords[bubble].s, 1],
      extrapolate: 'clamp',
      // easing: t => Math.sin(t * (Math.PI / 2)),
    })
    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
    }
  }
  public changeSearchSettings(change: any) {
    this.enableScroll()
    this.setState((prevState) => {
      return {
        ...prevState,
        ...(change.radius ? { searchRadius: change.radius } : null),
        ...(change.ageRange ? { searchAgeRange: change.ageRange } : null),
      }
    })
  }
  public changeProfile(change: any) {
    this.setState((prevState) => {
      return {
        ...prevState,
        // ...(change.food ? { profileFood: change.food } : null),
        ...(change.aboutMe ? { profileAboutMe: change.aboutMe } : null),
        ...(change.photos ? { photos: change.images } : null),
        ...(change.questions ? { profileQuestions: change.questions } : null),
        // work
        // Education
        // Tags
      }
    })
  }
  public enableScroll() {
    this.setState({ scrollEnabled: true })
  }
  public disableScroll() {
    this.setState({ scrollEnabled: false })
  }
  public scrollDown() {
    this.scrollView.getNode().scrollTo({ y: maxScroll, animated: true })
  }
  private postPhotos(photo: IMediaReference, index: number) {
    photoUpload(
      '/api/upload/image/profile',
      [photo],
      true,
      (progress, event) => {
        this.setState((prevState) => {
          return {
            ...prevState,
            photoProgress: Object.assign(
              [],
              prevState.photoProgress,
              { [index]: progress },
            ),
          }
        })
        console.log('photo upload progress: ', progress)
      }).then(({ err, errorMessage, urls }) => {
        if(err || !urls || !urls.length) {
          Alert.alert('Could not finish uploading Photos, try again later.')
        } else {
          this.setPhoto({ uri: urls[0] }, index)
        }
      })
  }
  private setPhoto(photo: IMediaReference, index: number) {
    this.setState((prevProps) => {
      const { photos } = prevProps
      photos[index] = photo
      return {
        ...prevProps,
        photos,
      }
    })
  }
  private clearPhoto(index: number) {
    console.log('clearing photo: ', index)
    this.setState((prevProps) => {
      const { photos } = prevProps
      photos[index] = undefined
      return {
        ...prevProps,
        photos,
      }
    })
  }
  public render() {
    if(
      !this.props.user ||
      this.props.user.unset ||
      (!this.props.user.profile || !this.props.user.profile.images)
    ) {
      return (
        <View>
          <Text>Hello There</Text>
        </View>
      )
    }
    const imageCover = {
      ...style.imageCover,
      opacity: this.state.scrollY.interpolate({
        inputRange: [15, Math.min(offsetY + (offsetY * 0.5), maxScroll - offsetY * 0.5), maxScroll],
        outputRange: [1, 0.95, 0],
        extrapolate: 'clamp',
      }),
    }
    let transformBubbles = new Array(6).fill({})
    transformBubbles = transformBubbles.map((obj, i, arr) => {
      return this.createTransition(i)
    })
    const pageOpacity = this.state.scrollY.interpolate({
      inputRange: [15, maxScroll - 10],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    })
    const searchSettings = {
      ...style.searchSettings,
      opacity: this.state.scrollY.interpolate({
        inputRange: [15, 60],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
      transform: [{
        translateY: this.state.scrollY.interpolate({
          inputRange: [0, 15, 60],
          outputRange: [0, -5, -30],
        }),
      }],
    }
    const cardSwipeText = {
      ...style.cardSwipeText,
      opacity: this.state.scrollY.interpolate({
        inputRange: [0, 20],
        outputRange: [0.8, 0],
        extrapolate: 'clamp',
      }),
      transform: [{
        translateY: this.state.scrollY.interpolate({
          inputRange: [0, 30],
          outputRange: [0, -16],
          extrapolate: 'clamp',
        }),
      }],
    }
    return (
      <KeyboardAvoidingView behavior="position" style={{ height, width }}>
        <Animated.ScrollView
          style={style.profileWrapper}
          contentContainerStyle={style.profileContainer}
          scrollEventThrottle={16}
          scrollEnabled={this.state.scrollEnabled}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            {
              useNativeDriver: true,
            },
          )}
          ref={(c: any) => this.scrollView = c}
        >
          <Animated.View style={{ ...style.pageBackground, opacity: pageOpacity }}/>
          <View style={style.imageGridAspectHelper}>
            <View
              style={style.imageGridWrapper}
            >
              <View style={style.imageGrid}>
                {new Array(6).fill(undefined).map((v, i, arr) => {
                  const imageWrapper = { ...style.imageWrapper, ...(i === 0 ? { zIndex: 1 } : null) }
                  return (
                    <View key={i} style={imageWrapper}>
                      <Animated.View style={{ ...style.imageContainer, ...transformBubbles[i] }}>
                        <SelectPhoto
                          source={this.state.photos[i] ? this.state.photos[i] : undefined}
                          uploadProgress={0.4}
                          overWhite
                          hideEditButton={this.state.hideEditButton}
                          onPhoto={(photo: IMediaReference) => this.postPhotos(photo, i)}
                          onDelete={() => this.clearPhoto(i)}
                        />
                        <Animated.View
                          style={{ ...imageCover, backgroundColor: bubbleColors[i] }}
                          pointerEvents="none"
                        />
                      </Animated.View>
                    </View>
                  )
                })}
              </View>
              <TouchableWithoutFeedback
                onPress={() => this.scrollDown()}
              >
                <View
                  style={style.bubbleCanvas}
                  pointerEvents={this.state.disableCanvas ? 'none' : 'box-only'}
                />
              </TouchableWithoutFeedback>
            </View>

            <Animated.View style={searchSettings} pointerEvents={this.state.disableCanvas ? 'none' : 'auto'}>
              <Text style={{ ...type.small, color: '#7B5394' }}>Search Settings</Text>
              <View style={style.searchSliderContainer}>
                <Text style={{ ...type.small, color: '#7B5394', opacity: 0.5 }}>Distance</Text>
                <Text
                  style={{
                    ...type.regular,
                    color: '#7B5394',
                  }}
                >
                  Up to {this.state.searchRadius} miles away
                </Text>
                <MultiSlider
                  values={[this.state.searchRadius]}
                  min={10}
                  max={100}
                  sliderLength={230}
                  onValuesChangeStart={() => this.disableScroll()}
                  onValuesChange={(values: number[]) => this.setState({ searchRadius: values[0] })}
                  onValuesChangeFinish={(values: number[]) => this.changeSearchSettings({ radius: values[0] })}
                />
              </View>
              <View style={style.searchSliderContainer}>
                <Text style={{ ...type.small, color: '#7B5394', opacity: 0.5 }}>Age</Text>
                <Text
                  style={{
                    ...type.regular,
                    color: '#7B5394',
                    opacity: 1,
                  }}
                >
                  Between {this.state.searchAgeRange[0]} and {this.state.searchAgeRange[1]}
                </Text>
                {/* <MultiSlider
                  values={this.state.searchAgeRange}
                  min={18}
                  max={100}
                  sliderLength={230}
                  onValuesChangeStart={() => this.disableScroll()}
                  onValuesChange={(values: any) => this.setState({ searchAgeRange: values })}
                  onValuesChangeFinish={(values: any) => this.changeSearchSettings({ ageRange: values })}
                /> */}
              </View>
            </Animated.View>

          </View>
          <View style={style.cardContainer}>
            <View style={style.cardSwipeWrapper}>
              <LinearGradient
                style={{
                  width: '100%',
                  height: spacing.xlarge,
                  alignItems: 'center' as 'center',
                }}
                colors={['#00000000', '#00000044']}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
              >
                <Animated.View style={style.cardSwipeBar}/>
                <Animated.Text style={cardSwipeText}>
                  Swipe Up to View and Edit Profile
                </Animated.Text>
              </LinearGradient>
            </View>

            {/* Place Profile Here*/}
            <View style={style.profile.header}>
              <Image
                source={{ uri: this.state.photos[0]!.uri }}
                style={style.profile.headerImage}
                resizeMode="cover"
              />
              <LinearGradient
                style={style.profile.headerContentContainer}
                colors={['#00000000', '#00000066']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              >
                <Text style={style.profile.headerTitle}>
                  {this.props.user.name}, {moment().diff(moment(this.props.user.birth), 'years').toString()}
                </Text>
              </LinearGradient>
            </View>
            <View style={style.profile.sectionContainer}>
              <Text style={style.profile.sectionTitle}>About Me</Text>
              <TextInput
                style={style.profile.sectionParagraph}
                placeholder="About Me..."
                value={this.state.profileAboutMe}
                onChangeText={(text: string) => this.setState({ profileAboutMe: text })}
                multiline
                numberOfLines={4}
              />
            </View>
            {
              /**
               * @todo Add toggling edit/save button to each section container to make exiting keyboard easier
               */
            }
            {this.state.photos[1] && <Image
              source={{ uri: this.state.photos[1]!.uri }}
              style={style.profile.image}
              resizeMode="cover"
            />}
            <View style={style.profile.sectionContainer}>
              <Text style={style.profile.sectionTitle}>
                What are some of your favorite Hobbies?
              </Text>
              <TextInput
                style={style.profile.sectionParagraph}
                placeholder="My Hobbies Are.."
                value={this.state.profileAboutMe}
                onChangeText={(text: string) => this.setState({ profileAboutMe: text })}
                multiline
                numberOfLines={4}
              />
            </View>
            {this.state.photos[2] && <Image
              source={{ uri: this.state.photos[2]!.uri }}
              style={style.profile.image}
              resizeMode="cover"
            />}
            {this.state.photos[3] && <Image
              source={{ uri: this.state.photos[3]!.uri }}
              style={style.profile.image}
              resizeMode="cover"
            />}
            {this.state.photos[4] && <Image
              source={{ uri: this.state.photos[4]!.uri }}
              style={style.profile.image}
              resizeMode="cover"
            />}
            {this.state.photos[5] && <Image
              source={{ uri: this.state.photos[5]!.uri }}
              style={style.profile.image}
              resizeMode="cover"
            />}
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const style = {
  profileWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#CF9AFB33',
  },
  pageBackground: {
    width,
    height,
    top: 0,
    left: 0,
    position: 'absolute' as 'absolute',
    backgroundColor: colors.white,
  },
  profileContainer: {
    paddingTop: startY,
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
  },
  imageGridAspectHelper: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    height: height - startY,
  },
  imageGridWrapper: {
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    maxWidth: 346,
    width: width - 32,
    flex: 0,
    aspectRatio: 1,
  },
  bubbleCanvas: {
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  imageGrid: {
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'space-between' as 'space-between',
  },
  imageWrapper: {
    flexBasis: '33%',
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center' as 'center',
  },
  imageContainer: {
    width: 85,
    height: 85,
  },
  imageCover: {
    borderRadius: 85/2,
    width: 85,
    height: 85,
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
  },
  searchSettings: {
    flex: 1,
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    backgroundColor: colors.transparent,
  },
  searchSliderContainer: {
    flexDirection: 'column' as 'column',
    alignItems: 'flex-start' as 'flex-start',
    justifyContent: 'center' as 'center',
  },
  cardContainer: {
    marginTop: height - (bubbleCanvasWidth + startY) - 96,
    borderRadius: 16,
    backgroundColor: '#fff',
    minHeight: height,
    width: width - 32,
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    shadowColor: colors.cosmos,
    shadowRadius: 4,
    shadowWidth: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    transform: [{
      translateY: -1 * (height - bubbleCanvasWidth - startY),
    }],
    overflow: 'hidden' as 'hidden',
  },
  cardSwipeWrapper: {
    width: '100%',
    height: spacing.large,
    top: 0,
    zIndex: 1,
    position: 'absolute' as 'absolute',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'flex-start' as 'flex-start',
  },
  cardSwipeBar: {
    width: spacing.xlarge,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
    marginTop: 8,
    opacity: 0.8,
  },
  cardSwipeText: {
    ...type.small,
    color: colors.white,
    marginTop: 12,
  },
  profile: {
    header: {
      height: height - startY - spacing.xlarge,
      backgroundColor: colors.wisteria,
      width: '100%',
    },
    headerImage: {
      width: '100%',
      height: '100%',
    },
    headerContentContainer: {
      position: 'absolute' as 'absolute',
      height: 128,
      width: '100%',
      left: 0,
      bottom: 0,
      flexDirection: 'column-reverse' as 'column-reverse',
      padding: spacing.small,
    },
    headerTitle: {
      ...type.title2,
      color: colors.white,
    },
    sectionContainer: {
      width: '100%',
      padding: spacing.base,
      paddingBottom: spacing.large,
      backgroundColor: colors.wisteria,
    },
    sectionTitle: {
      ...type.small,
      color: colors.white,
      opacity: 0.7,
      marginBottom: spacing.tiny,
    },
    sectionShortAnswer: {
      ...type.title2,
      color: colors.white,
    },
    sectionParagraph: {
      ...type.title3,
      color: colors.white,
    },
    image: {
      width: '100%',
      height: maxScroll,
    },
  },
}
