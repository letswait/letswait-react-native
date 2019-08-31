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

// import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { colors, spacing, type } from '../../../../foundation'
import SelectPhoto from '../../../components/Buttons/SelectPhoto'
import FeatherButton from '../../../components/Camera/CameraButton'
import { ObjectOf } from '../../../types/helpers';
import { IMediaReference } from '../../../types/photos'
const { width, height } = Dimensions.get('screen')

/**
 * @todo this needs to be cleaned up and turned into its own component. but for now it works, but its disorganized
 * @todo I need to size this to other screens, it should work for most, but shorter screens need an option
 */

import RNHeicConverter from 'react-native-heic-converter';
import { ReduxStore } from '../../../types/models';
import AddImage from './AddImage';

type Question =
  'Favorite Hobbies...'
| 'The actor who would play me in a movie about my life...'
| 'What drives me...'
| 'Listener or talker...'

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
  showToast: (text: string) => void
  setUser: (user: ReduxStore.User) => void,
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
  photoProgress: number[]
  settings: {
    profile: ReduxStore.IUserProfile,
    // searchSettings: ReduxStore.IUserSearchSettings,
    // hideUser: boolean,
  }
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
    settings: {
      profile: {
        ...this.props.user.profile,
        aboutMe: this.props.user.profile.aboutMe || '',
        questions: this.props.user.profile.questions || {
          'Favorite Hobbies...': '',
          'The actor who would play me in a movie about my life...': '',
          'What drives me...': '',
          'Listener or talker...': '',
        },
      },
    },
    photoProgress: new Array(6).fill(0),
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
  public commitChanges(cb: (shouldRefreshAppState: boolean) => any) {
    // Meant to be called by parent AppRouterComponent
    // Checks for any changes to profile and returns true/false if a change has been requested.
    // It makes the request and thunks the new user object in
    // true/false response allows app to rerequest things like feed
  }
  public shouldComponentUpdate() {
    if(!this.state.prerendered && !this.props.disablePrerender) {
      this.setState({ prerendered: true })
      return true
    }
    return !!this.props.shouldUpdate
  }
  private createTransition(bubble: number) {
    const inputRange = [15, maxScroll]
    const translateX = this.state.scrollY.interpolate({
      inputRange,
      outputRange: [endCoords[bubble].x, 0],
      extrapolate: 'clamp',
    })
    const translateY = this.state.scrollY.interpolate({
      inputRange: [15, maxScroll],
      outputRange: [endCoords[bubble].y, offsetY],
      extrapolate: 'clamp',
    })
    const scale = this.state.scrollY.interpolate({
      inputRange,
      outputRange: [endCoords[bubble].s, 1],
      extrapolate: 'clamp',
    })
    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
    }
  }
  private scrollDown() {
    this.scrollView.getNode().scrollTo({ y: maxScroll, animated: true })
  }
  private postPhotos(photo: IMediaReference, index: number) {
    // if(photo.type === 'image/heic') {
    RNHeicConverter
      .convert({ // options
        path: photo.uri,
      })
      .then((result: any) => {
        this.props.showToast(`Converted HEIC: ${result} ${photo}`)
        photoUpload(
          '/api/upload/image/profile',
          [{ uri: result.path, type: 'image/jpeg' }] ,
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
              this.pushPhoto({ uri: urls[0] }, index)
            }
          })
      });
  }
  private pushPhoto(photo: { uri: string }, index: number) {
    const images = [...this.props.user.profile.images]
    images[index] = photo.uri
    this.props.setUser({
      ...this.props.user,
      profile: {
        ...this.props.user.profile,
        images,
      },
    })
  }
  private clearPhoto(index: number) {
    const images = [
      ...this.props.user.profile.images.slice(0, index),
      ...this.props.user.profile.images.slice(index + 1),
    ]
    this.props.setUser({
      ...this.props.user,
      profile: {
        ...this.props.user.profile,
        images,
      },
    })
  }
  private changeAboutMe(text: string) {
    this.setState({
      settings: {
        ...this.props.user,
        profile: {
          ...this.props.user.profile,
          aboutMe: text,
        },
      },
    })
  }
  private pushAboutMe(text: string) {
    this.props.setUser({
      ...this.props.user,
      profile: {
        ...this.props.user.profile,
        aboutMe: text,
      },
    })
  }
  private changeQA(question: Question, answer: string) {
    const questions = { ...this.state.settings.profile.questions }
    questions[question] = answer
    this.setState({
      settings: {
        ...this.props.user,
        profile: {
          ...this.props.user.profile,
          questions,
        },
      },
    })
  }
  private pushQA(question: Question, answer: string) {
    const questions = { ...this.state.settings.profile.questions }
    questions[question] = answer
    this.props.setUser({
      ...this.props.user,
      profile: {
        ...this.props.user.profile,
        questions,
      },
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
    const images = this.state.settings.profile.images
    return (
      <KeyboardAvoidingView behavior="padding" style={{ height, width }}>
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
                          source={this.state.settings.profile.images[i] ?
                            { uri: this.state.settings.profile.images[i] } as IMediaReference :
                            undefined
                          }
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
              <FastImage
                source={{ uri: this.state.settings.profile.images[0] }}
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
                value={this.state.settings.profile.aboutMe}
                onChangeText={(text: string) => this.changeAboutMe(text)}
                onBlur={e => this.pushAboutMe(e.nativeEvent.text)}
                multiline
                numberOfLines={4}
              />
            </View>
            {
              /**
               * @todo Add toggling edit/save button to each section container to make exiting keyboard easier
               */
            }
            <AddImage
              source={images[1]}
              onPhoto={(photo: IMediaReference) => this.postPhotos(photo, 1)}
              onDelete={() => this.clearPhoto(1)}
            />
            <View style={style.profile.sectionContainer}>
              <Text style={style.profile.sectionTitle}>
                Favorite Hobbies...
              </Text>
              <TextInput
                style={style.profile.sectionParagraph}
                placeholder="Add Answer..."
                value={
                  this.state.settings.profile.questions &&
                  this.state.settings.profile.questions['Favorite Hobbies...'] || ''}
                onChangeText={(text: string) => this.changeQA('Favorite Hobbies...', text)}
                onBlur={e => this.pushQA('Favorite Hobbies...', e.nativeEvent.text)}
                multiline
                numberOfLines={4}
              />
            </View>
            <AddImage
              source={images[2]}
              onPhoto={(photo: IMediaReference) => this.postPhotos(photo, 2)}
              onDelete={() => this.clearPhoto(2)}
            />
            {/* {this.state.settings.profile.images[2] && <FastImage
              source={{ uri: this.state.settings.profile.images[2] }}
              style={style.profile.image}
              resizeMode="cover"
            />} */}
            <View style={style.profile.sectionContainer}>
              <Text style={style.profile.sectionTitle}>
                The actor who would play me in a movie about my life...
              </Text>
              <TextInput
                style={style.profile.sectionParagraph}
                placeholder="Add Answer..."
                // tslint:disable-next-line: max-line-length
                value={
                  this.state.settings.profile.questions &&
                  this.state.settings.profile.questions['The actor who would play me in a movie about my life...']
                || ''}
                // tslint:disable-next-line: max-line-length
                onChangeText={(text: string) => this.changeQA('The actor who would play me in a movie about my life...', text)}
                onBlur={e => this.pushQA('The actor who would play me in a movie about my life...', e.nativeEvent.text)}
                multiline
                numberOfLines={4}
              />
            </View>
            <AddImage
              source={images[3]}
              onPhoto={(photo: IMediaReference) => this.postPhotos(photo, 3)}
              onDelete={() => this.clearPhoto(3)}
            />
            {/* {this.state.settings.profile.images[3] && <FastImage
              source={{ uri: this.state.settings.profile.images[3] }}
              style={style.profile.image}
              resizeMode="cover"
            />} */}
            <View style={style.profile.sectionContainer}>
              <Text style={style.profile.sectionTitle}>
                What drives me...
              </Text>
              <TextInput
                style={style.profile.sectionParagraph}
                placeholder="Add Answer..."
                value={this.state.settings.profile.questions &&
                  this.state.settings.profile.questions['What drives me...'] || ''}
                onChangeText={(text: string) => this.changeQA('What drives me...', text)}
                onBlur={e => this.pushQA('What drives me...', e.nativeEvent.text)}
                multiline
                numberOfLines={4}
              />
            </View>
            <AddImage
              source={images[4]}
              onPhoto={(photo: IMediaReference) => this.postPhotos(photo, 4)}
              onDelete={() => this.clearPhoto(4)}
            />
            {/* {this.state.settings.profile.images[4] && <FastImage
              source={{ uri: this.state.settings.profile.images[4] }}
              style={style.profile.image}
              resizeMode="cover"
            />} */}
            <View style={style.profile.sectionContainer}>
              <Text style={style.profile.sectionTitle}>
                Listener or talker...
              </Text>
              <TextInput
                style={style.profile.sectionParagraph}
                placeholder="Add Answer..."
                value={this.state.settings.profile.questions &&
                  this.state.settings.profile.questions['Listener or talker...'] || ''}
                onChangeText={(text: string) => this.changeQA('Listener or talker...', text)}
                onBlur={e => this.pushQA('Listener or talker...', e.nativeEvent.text)}
                multiline
                numberOfLines={4}
              />
            </View>
            <AddImage
              source={images[5]}
              onPhoto={(photo: IMediaReference) => this.postPhotos(photo, 5)}
              onDelete={() => this.clearPhoto(5)}
            />
            {/* {this.state.settings.profile.images[5] && <FastImage
              source={{ uri: this.state.settings.profile.images[5] }}
              style={style.profile.image}
              resizeMode="cover"
            />} */}
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
  },
}
