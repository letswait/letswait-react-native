import React, { Children } from 'react'
import {
  ActionSheetIOS,
  Alert,
  Animated,
  Easing,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'

import CameraModal from '../Camera/Camera'
import CameraRollModal from '../CameraRoll/CameraRoll'

import Feather from 'react-native-vector-icons/Feather'
import { colors } from '../../../new_foundation'
import { IMediaReference } from '../../types/photos';

interface IProps {
  source?: IMediaReference
  style?: any
  onPhoto: (photo: IMediaReference) => any
  onDelete: (photo: IMediaReference) => any
  uploadProgress?: number
  overWhite?: boolean
  hideEditButton?: boolean
}
interface IState {
  selectedPhoto?: IMediaReference
  animationProgress: Animated.Value,
  modalVisible: boolean,
  preparedModal: string,
  borderColor: string,
}
/**
 * @class SelectPhoto
 * @description Photo Selection button that can access camera or cameraRoll
 * @todo add android version of action sheet using bottomsheet by Flipboard
 */
export default class SelectPhoto extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      selectedPhoto: this.props.source || undefined,
      animationProgress: new Animated.Value(!!this.props.source ? 1 : 0),
      modalVisible: false,
      preparedModal: '',
      borderColor: props.overWhite ? colors.capri : colors.white,
    }
  }
  public componentDidUpdate(prevProps: IProps, oldState: IState) {
    if(prevProps.source !== this.props.source) {
      this.setState((prevState) => {
        return {
          ...prevState,
          selectedPhoto: this.props.source,
        }
      })
    }
    if(oldState.selectedPhoto !== this.state.selectedPhoto) {
      if(!oldState.selectedPhoto) {
        this.animateIn()
      }
    }
  }
  private presentActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: 'From where would you like to upload a photo',
        options: ['Cancel', 'Choose from Library', 'Camera'],
        cancelButtonIndex: 0,
      },
      (buttonIndex: number) => {
        if(buttonIndex === 1) {
          this.openModal('cameraRoll')
        } else if(buttonIndex === 2) {
          this.openModal('camera')
        }
      },
    )
  }
  private presentRemovalActionSheet() {
    if(!!this.state.selectedPhoto) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Are you sure you want to delete this photo?',
          options: ['Cancel', 'Delete Photo'],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 1,
        },
        (buttonIndex: number) => {
          if(buttonIndex === 1) {
            this.animateOut()
            this.props.onDelete(this.state.selectedPhoto!)
          }
        },
      )
    }
  }
  public openModal(name: string) {
    if(!this.state.modalVisible && name && name !== '') {
      this.setState((prevState) => {
        return {
          ...prevState,
          modalVisible: true,
          preparedModal: name,
        }
      })
    }
  }
  public closeModal() {
    if(this.state.modalVisible) {
      this.setState((prevState) => {
        return {
          ...prevState,
          modalVisible: false,
          preparedModal: '',
        }
      })
    }
  }
  public receiveImages(photo: IMediaReference) {
    this.props.onPhoto(photo)
    this.setState({ selectedPhoto: photo })
    this.closeModal()
  }
  private animateIn() {
    Animated.timing(
      this.state.animationProgress,
      {
        toValue: 1,
        easing: Easing.inOut(Easing.ease),
        duration: 300,
      },
    ).start(() => {
      return null
    })
  }
  private animateOut() {
    Animated.timing(
      this.state.animationProgress,
      {
        toValue: 0,
        easing: Easing.inOut(Easing.ease),
        duration: 300,
      },
    ).start(() => {
      this.setState((prevState: IState): IState => {
        return {
          ...prevState,
          selectedPhoto: undefined,
        }
      })
    })
  }
  public render() {
    const borderColor = this.state.animationProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.white, this.state.borderColor],
    })
    return (
      <View style={{ ...style.wrapper, ...this.props.style }}>
        <TouchableOpacity
          onPress={() => this.presentActionSheet()}
          onLongPress={() => this.presentRemovalActionSheet()}
        >
          <Animated.View
            style={{
              ...style.container,
              borderColor,
            }}
          >
          <Feather name="plus" size={24} color={colors.white}/>
          {this.state.selectedPhoto ? (
            <Animated.View
              style={{
                ...style.imageWrapper,
                transform: [
                  { scale: this.state.animationProgress },
                ],
              }}
            >
            {this.state.selectedPhoto.type ? (
              <Image
                source={{ uri: this.state.selectedPhoto.uri }}
                style={style.image}
              />
            ) : (
              <FastImage
                source={{ uri: this.state.selectedPhoto.uri }}
                style={style.image}
              />
            )}
            </Animated.View>
          ) : null}
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.presentActionSheet()}
          style={{ ...style.badgeWrapper, ...(this.props.hideEditButton ? { display: 'none' as 'none' } : null) }}
        >
          <Animated.View
            style={{
              ...style.badge,
              borderColor,
              opacity: this.state.animationProgress,
            }}
          >
            <Feather name="edit-3" size={16} color={colors.coralBlue}/>
          </Animated.View>
        </TouchableOpacity>
        <Modal
          visible={this.state.modalVisible}
          presentationStyle="fullScreen"
          animationType="slide"
        >
          {({
            camera:(
              <CameraModal
                onClose={() => this.closeModal()}
                onSelect={(photo: IMediaReference) => this.receiveImages(photo)}
              />
            ),
            cameraRoll:(
              <CameraRollModal
                onClose={() => this.closeModal()}
                onSelect={(photo: IMediaReference) => this.receiveImages(photo)}
              />
            ),
          } as any)[this.state.preparedModal]}
        </Modal>
      </View>
    )
  }
}

const style = {
  wrapper: {
    height: 85,
    width: 85,
  },
  container: {
    justifyContent: 'center' as 'center',
    alignItems: 'center' as  'center',
    backgroundColor: colors.transparentWhite,
    borderWidth: 2,
    borderRadius: 85/2,
    height: 85,
    width: 85,
    overflow: 'hidden' as 'hidden',
  },
  imageWrapper: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
  },
  image: {
    width: 81,
    height: 81,
  },
  badgeWrapper: {
    position: 'absolute' as 'absolute',
    top: 0,
    right: 0,
    // borderColor: colors.saffron,
  },
  badge: {
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.turmeric,
    height: 24,
    width: 24,
    borderRadius: 24,
    justifyContent: 'center' as  'center',
    alignItems: 'center' as 'center',
  },
}
