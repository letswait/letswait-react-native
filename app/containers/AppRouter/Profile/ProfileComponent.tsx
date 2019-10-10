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

import LinearGradient from 'react-native-linear-gradient'

import { photoUpload } from '../../../lib/api'

import { colors, type } from '../../../../new_foundation'

// import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper'
import SelectPhoto from '../../../components/Buttons/SelectPhoto'
import FeatherButton from '../../../components/Camera/CameraButton'
import { ObjectOf } from '../../../types/helpers';
import { IMediaReference } from '../../../types/photos'
const { width, height } = Dimensions.get('screen')

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/**
 * @todo this needs to be cleaned up and turned into its own component. but for now it works, but its disorganized
 * @todo I need to size this to other screens, it should work for most, but shorter screens need an option
 */

import RNHeicConverter from 'react-native-heic-converter';
import { ReduxStore } from '../../../types/models';
import AddImage from './AddImage';

type Question =
  'Favorite Hobbies'
  | 'The actor who would play me in a movie about my life'
  | 'What drives me'
  | 'Listener or talker'

const bubbleCanvasWidth = Math.max(width - 32, 320)
const startY = isIphoneX ? 184 : 160

const maxScroll = 350

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
  }
  public commitChanges(cb: (shouldRefreshAppState: boolean) => any) {
    // Meant to be called by parent AppRouterComponent
    // Checks for any changes to profile and returns true/false if a change has been requested.
    // It makes the request and thunks the new user object in
    // true/false response allows app to rerequest things like feed
  }
  public shouldComponentUpdate() {
    if (!this.state.prerendered && !this.props.disablePrerender) {
      this.setState({ prerendered: true })
      return true
    }
    return !!this.props.shouldUpdate
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
          [{ uri: result.path, type: 'image/jpeg' }],
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
            if (err || !urls || !urls.length) {
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
  private headerText: any = null
  public render() {
    if (
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
    const images = this.state.settings.profile.images
    const questions = this.state.settings.profile.questions
    return (
      <View>
        <Animated.View
          style={style.headerGradient}
        >
          <LinearGradient
            colors={[
              'rgba(33, 33, 33, 1)',
              'rgba(17, 17, 17, 0.63)',
              'rgba(0, 0, 0, 0.25)',
              'rgba(0, 0, 0, 0.10)',
              'rgba(0, 0, 0, 0)',
            ]}
            style={style.headerGradient}
          />
        </Animated.View>
        <Animated.Text
          style={style.headerText}
          ref={(c: any) => this.headerText = c}
        >
          {this.props.user.name}
        </Animated.Text>
        <KeyboardAwareScrollView
          style={style.profileWrapper}
          contentContainerStyle={style.profileContainer}
          scrollEventThrottle={16}
          scrollEnabled={this.state.scrollEnabled}
          onScroll={(event) => {
            if(!!this.headerText) {
              const opacity = Math.floor(Math.max(0, Math.min(100, event.nativeEvent.contentOffset.y)))/100
              this.headerText.setNativeProps({ style: { ...style.headerText, opacity: 1 - opacity } })
            }
          }}
          keyboardOpeningTime={50}
          enableResetScrollToCoords={false}
        >

          <View style={style.cardContainer}>
            <View style={style.profile.header}>
              <AddImage
                source={images[0]}
                onPhoto={(photo: IMediaReference) => this.postPhotos(photo, 0)}
                height={height - startY - 64}
              />
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
            <AddImage
              source={images[1]}
              onPhoto={(photo: IMediaReference) => this.postPhotos(photo, 1)}
            />
            <View style={style.profile.sectionContainer}>
              <Text style={style.profile.sectionTitle}>
                Favorite Hobbies...
              </Text>
              <TextInput
                style={style.profile.sectionParagraph}
                placeholder="Add Answer..."
                value={
                  questions && questions['Favorite Hobbies'] ?
                  questions['Favorite Hobbies'] : ''
                }
                onChangeText={(text: string) => this.changeQA('Favorite Hobbies', text)}
                onBlur={e => this.pushQA('Favorite Hobbies', e.nativeEvent.text)}
                multiline
                numberOfLines={4}
              />
            </View>
            <AddImage
              source={images[2]}
              onPhoto={(photo: IMediaReference) => this.postPhotos(photo, 2)}
            />
            <View style={style.profile.sectionContainer}>
              <Text style={style.profile.sectionTitle}>
                The actor who would play me in a movie about my life...
              </Text>
              <TextInput
                style={style.profile.sectionParagraph}
                placeholder="Add Answer..."
                // tslint:disable-next-line: max-line-length
                value={
                  questions && questions['The actor who would play me in a movie about my life'] ?
                  questions['The actor who would play me in a movie about my life'] : ''
                }
                // tslint:disable-next-line: max-line-length
                onChangeText={(text: string) => this.changeQA('The actor who would play me in a movie about my life', text)}
                onBlur={e => this.pushQA('The actor who would play me in a movie about my life', e.nativeEvent.text)}
                multiline
                numberOfLines={4}
              />
            </View>
            <AddImage
              source={images[3]}
              onPhoto={(photo: IMediaReference) => this.postPhotos(photo, 3)}
              onDelete={() => this.clearPhoto(3)}
            />
            <View style={style.profile.sectionContainer}>
              <Text style={style.profile.sectionTitle}>
                What drives me...
              </Text>
              <TextInput
                style={style.profile.sectionParagraph}
                placeholder="Add Answer..."
                value={
                  questions && questions['What drives me'] ?
                  questions['What drives me'] : ''
                }
                onChangeText={(text: string) => this.changeQA('What drives me', text)}
                onBlur={e => this.pushQA('What drives me', e.nativeEvent.text)}
                multiline
                numberOfLines={4}
              />
            </View>
            <AddImage
              source={images[4]}
              onPhoto={(photo: IMediaReference) => this.postPhotos(photo, 4)}
              onDelete={() => this.clearPhoto(4)}
            />
            <View style={style.profile.sectionContainer}>
              <Text style={style.profile.sectionTitle}>
                Listener or talker...
              </Text>
              <TextInput
                style={style.profile.sectionParagraph}
                placeholder="Add Answer..."
                value={
                  questions && questions['Listener or talker'] ?
                  questions['Listener or talker'] : ''
                }
                onChangeText={(text: string) => this.changeQA('Listener or talker', text)}
                onBlur={e => this.pushQA('Listener or talker', e.nativeEvent.text)}
                multiline
                numberOfLines={4}
              />
            </View>
            <AddImage
              source={images[5]}
              onPhoto={(photo: IMediaReference) => this.postPhotos(photo, 5)}
              onDelete={() => this.clearPhoto(5)}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const style = {
  profileWrapper: {
    width,
    height,
    backgroundColor: colors.seafoam,
  },
  profileContainer: {
    paddingTop: startY + 32,
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
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
    borderRadius: 85 / 2,
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
    height: 48,
    top: 0,
    zIndex: 1,
    position: 'absolute' as 'absolute',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'flex-start' as 'flex-start',
  },
  cardSwipeBar: {
    width: 64,
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
  headerGradient: {
    width,
    height: 200,
    top: 0,
    left: 0,
    opacity: 0.5,
    position: 'absolute' as 'absolute',
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    zIndex: 1,
  },
  headerText: {
    ...type.title2,
    width,
    color: colors.white,
    top: ifIphoneX(64, 35),
    left: 0,
    position: 'absolute' as 'absolute',
    textAlign: 'center' as 'center',
    zIndex: 1,
  },
  profile: {
    header: {
      height: height - startY - 64,
      backgroundColor: colors.white,
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
      padding: 16,
    },
    headerTitle: {
      ...type.title2,
      color: colors.white,
    },
    sectionContainer: {
      width: '100%',
      padding: 24,
      paddingBottom: 48,
      backgroundColor: colors.white,
    },
    sectionTitle: {
      ...type.small,
      color: colors.shadow,
      opacity: 0.7,
      marginBottom: 8,
    },
    sectionShortAnswer: {
      ...type.title2,
      color: colors.cosmos,
    },
    sectionParagraph: {
      ...type.large,
      color: colors.cosmos,
    },
  },
}
