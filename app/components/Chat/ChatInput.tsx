import React from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native'

import { ifIphoneX } from 'react-native-iphone-x-helper'

import Feather from 'react-native-vector-icons/Feather'
import { colors, type } from '../../../new_foundation'
import { IMediaReference } from '../../types/photos';

import CameraModal from '../Camera/Camera'
import CameraRollModal from '../CameraRoll/CameraRoll'

import FeatherButton from '../Camera/CameraButton'

const { height, width } = Dimensions.get('window')

interface IProps {
  onSend: (message: string) => any,
  onSendImage: (photo: IMediaReference) => any,
  keyboardWillHide: () => void
  keyboardWillShow: () => void
}
interface IState {
  message: string
  modalVisible: boolean
  preparedModal: 'camera' | 'cameraRoll' | ''
  toolbarSlideout: Animated.Value
  toolbarVisible: boolean
  keyboardVisible: boolean
  height: number
}
export default class ChatInput extends React.PureComponent<IProps, IState> {
  public keyboardWillShowListener: any
  public keyboardWillHideListener: any
  constructor(props: IProps) {
    super(props)
    this.state = {
      message: '',
      modalVisible: false,
      preparedModal: '',
      toolbarSlideout: new Animated.Value(0),
      toolbarVisible: true,
      keyboardVisible: false,
      height: 0,
    }
  }
  public componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => this.keyboardWillShow(),
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => this.keyboardWillHide(),
    );
  }
  public componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }
  public keyboardWillShow() {
    if(this.props.keyboardWillShow) this.props.keyboardWillShow()
    this.hideToolbar()
  }
  public keyboardWillHide() {
    if(this.props.keyboardWillHide) this.props.keyboardWillHide()
    this.showToolbar()
  }
  public toggleToolbar() {
    if(this.state.toolbarVisible) {
      this.hideToolbar()
    } else {
      this.showToolbar()
    }
  }
  public showToolbar() {
    this.setState({ toolbarVisible: true })
    Animated.timing(this.state.toolbarSlideout, {
      toValue: 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start()
  }
  public hideToolbar() {
    this.setState({ toolbarVisible: false })
    Animated.timing(this.state.toolbarSlideout, {
      toValue: 1,
      duration: 300,
    }).start()
  }
  public openModal(name: 'camera' | 'cameraRoll' | '') {
    if (!this.state.modalVisible && name && !!name.length) {
      this.setState((prevState: IState): IState => {
        return {
          ...prevState,
          modalVisible: true,
          preparedModal: name,
        }
      })
    }
  }
  public closeModal() {
    if (this.state.modalVisible) {
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
    console.log('received image:', photo)
    this.props.onSendImage(photo)
    this.closeModal()
  }
  public onChange(text: string) {
    this.setState((prevState: IState): IState => {
      return {
        ...prevState,
        message: text,
      }
    })
  }
  public onSend() {
    if (this.state.message) {
      this.props.onSend(this.state.message)
      this.setState({ message: '' })
    }
  }
  public render() {
    const sendIconWrapper = {
      ...style.sendIconWrapper,
      opacity: this.state.message ? 0.4 : 1,
    }
    const toolbar = {
      ...style.toolbar,
      maxWidth: this.state.toolbarSlideout.interpolate({
        inputRange: [0, 1],
        outputRange: [102, 0],
      }),
    }
    const summonToolbarBackground = {
      ...style.summonToolbarBackground,
      backgroundColor: this.state.toolbarSlideout.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.shadow, colors.turmeric],
      }),
    }
    const input = {
      ...style.input,
      height: this.state.height,
    }
    return (
      <View>
        <View style={style.contentWrapper}>
          <Animated.View style={toolbar}>
            <TouchableOpacity
              style={style.actionButtonContainer}
              onPress={() => this.openModal('camera')}
            >
              <Feather name="camera" color={colors.white} size={31} />
            </TouchableOpacity>
            <TouchableOpacity
              style={style.actionButtonContainer}
              onPress={() => this.openModal('cameraRoll')}
            >
              <Feather name="image" color={colors.white} size={31} />
            </TouchableOpacity>
          </Animated.View>
          <View style={style.inputContainer} pointerEvents="box-none">
            <View style={style.summonToolbar}>
              <Animated.View style={summonToolbarBackground}/>
              <FeatherButton
                name={this.state.toolbarVisible ? 'chevron-left' : 'chevron-right'}
                color={colors.white}
                size={25}
                onPress={() => this.toggleToolbar()}
                style={{
                  position: 'absolute' as 'absolute',
                }}
              />
            </View>
            <TextInput
              style={input}
              value={this.state.message}
              onChangeText={(text: string) => this.onChange(text)}
              multiline
              numberOfLines={1}
              onContentSizeChange={(event) => {
                this.setState({ height: event.nativeEvent.contentSize.height + 24 })
              }}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={sendIconWrapper}
              onPress={() => this.onSend()}
            >
              <Feather
                name="send"
                color={colors.mustard}
                size={25}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          visible={this.state.modalVisible}
          presentationStyle="fullScreen"
          animationType="slide"
        >
          {({
            camera: (
              <CameraModal
                onClose={() => this.closeModal()}
                onSelect={(photo: IMediaReference) => this.receiveImages(photo)}
              />
            ),
            cameraRoll: (
              <CameraRollModal
                onClose={() => this.closeModal()}
                onSelect={(photo: IMediaReference) => this.receiveImages(photo)}
                approveLabel="Send"
                mediaType="All"
              />
            ),
          } as any)[this.state.preparedModal]}
        </Modal>
      </View>
    )
  }
}

const style = {
  contentWrapper: {
    marginTop: 8,
    marginLeft: 12,
    marginRight: 12,
    width: width - 24,
    flexDirection: 'row' as 'row',
    alignItems: 'flex-end' as 'flex-end',
  },
  actionButtonContainer: {
    width: 43,
    height: 43,
    borderRadius: 10,
    backgroundColor: colors.mustard,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    marginRight: 8,
  },
  toolbar: {
    flex: 0,
    flexGrow: 0,
    flexDirection: 'row' as 'row',
    overflow: 'hidden' as 'hidden',
  },
  summonToolbar: {
    marginTop: 9,
    marginBottom: 9,
    width: 33,
    height: 25,
    zIndex: 1,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    overflow: 'hidden' as 'hidden',
  },
  summonToolbarBackground: {
    width: 17,
    height: 25,
    borderRadius: 3,
  },
  inputContainer: {
    borderRadius: 10,
    minHeight: 43,
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'row' as 'row',
    alignItems: 'flex-end' as 'flex-end',
  },
  input: {
    ...type.regular,
    color: colors.cosmos,
    lineHeight: 19,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 12,
    minHeight: 43,
    flex: 1,
    maxHeight: 300,
  },
  sendIconWrapper: {
    width: 52,
    height: 43,
    zIndex: 1,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
}
