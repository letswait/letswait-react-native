import React, { ReactNode } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native'

import { ifIphoneX } from 'react-native-iphone-x-helper'

import Feather from 'react-native-vector-icons/Feather'
import { colors, type } from '../../../new_foundation'
import { IMediaReference } from '../../types/photos';

import CameraModal from '../Camera/Camera'
import CameraRollModal from '../CameraRoll/CameraRoll'

import { ReduxStore } from '../../../app/types/models'
import FeatherButton from '../Camera/CameraButton'

const { height, width } = Dimensions.get('window')

interface IProps {
  onSend: (message: ReduxStore.IMessage) => any,
  keyboardWillHide: () => void
  keyboardWillShow: () => void
}
interface IState {
  text: string
  modalVisible: boolean
  preparedModal: 'camera' | 'cameraRoll' | ''
  toolbarSlideout: Animated.Value
  toolbarVisible: boolean
  keyboardVisible: boolean
  height: number
  sendOpacity: Animated.Value
  inputHeight: Animated.Value
}
export default class ChatInput extends React.PureComponent<IProps, IState> {
  public keyboardWillShowListener: any
  public keyboardWillHideListener: any
  constructor(props: IProps) {
    super(props)
    this.state = {
      text: '',
      modalVisible: false,
      preparedModal: '',
      toolbarSlideout: new Animated.Value(0),
      toolbarVisible: true,
      keyboardVisible: false,
      height: 0,
      sendOpacity: new Animated.Value(0.3),
      inputHeight: new Animated.Value(43),
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
    // this.setState({ inputFocussed: true }, () => {
    // })
    // if(this.textInput) this.textInput.focus()
  }
  public keyboardWillHide() {
    if(this.props.keyboardWillHide) this.props.keyboardWillHide()
    this.showToolbar()
    // this.setState({ inputFocussed: false }, () => {
    // })
  }
  public lastInputHeight: number = 43
  public showToolbar() {
    this.setState({ toolbarVisible: true })
    const lastInputHeight = (this.state.inputHeight as any)._value + 0
    this.lastInputHeight = lastInputHeight !== 43 ? lastInputHeight : this.lastInputHeight
    // Alert.alert(this.lastInputHeight.toString())
    // tslint:disable-next-line: max-line-length
    // Alert.alert('Attempting to Hide Toolbar',this.lastInputHeight.toString() + '  ' + (this.state.inputHeight as any).__getValue())
    Animated.parallel([
      Animated.timing(this.state.inputHeight, {
        toValue: 43,
        duration: 300,
      }),
      Animated.timing(this.state.toolbarSlideout, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start()
    // .start(() => {
    //   this.setState({ inputFocussed: false })
    // })
  }
  public hideToolbar() {
    this.setState({ toolbarVisible: false })
    let inputHeight = 43
    // if(this.textInput) {
    inputHeight = Math.max(43, Math.min(maxInputHeight, parseInt(this.lastInputHeight.toString(), 10)))
      // this.textInput.measure((x, y, w, h, px, py) => {
      //   inputHeight = Math.max(43, Math.min(250, h + 24))
      // })
    // }
    // tslint:disable-next-line: no-unused-expression
    // inputHeight !== 43 && Alert.alert('Attempting to Hide Toolbar',this.lastInputHeight.toString())
    Animated.parallel([
      Animated.timing(this.state.inputHeight, {
        toValue: inputHeight,
        duration: 300,
      }),
      Animated.timing(this.state.toolbarSlideout, {
        toValue: 1,
        duration: 300,
      }),
    ]).start()
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
    this.props.onSend({ image: photo.uri })
    this.closeModal()
  }
  public onChange(text: string) {
    if(text !== this.state.text && (!text || !this.state.text)) {
      Animated.timing(this.state.sendOpacity, {
        toValue: text ? 1 : 0.3,
        duration: 100,
        useNativeDriver: true,
      }).start()
    }
    this.setState((prevState: IState): IState => {
      return {
        ...prevState,
        text,
      }
    })
  }
  public onSend() {
    if(this.state.text) {
      this.props.onSend({ text: this.state.text })
      this.setState({ text: '' })
    }
  }
  public changeInputHeight(inputHeight: number) {
    Animated.timing(this.state.inputHeight, {
      toValue: Math.min(maxInputHeight, inputHeight),
      duration: 200,
      // easing: Easing.out(Easing.elastic(1)),
    }).start()
  }
  public renderToolbar(toolbarStyle: any) {
    return (
      <Animated.View style={toolbarStyle}>
        <TouchableOpacity
          style={style.actionButtonContainer}
          onPress={() => this.openModal('cameraRoll')}
        >
          <Feather name="image" color={colors.white} size={24} />
        </TouchableOpacity>
        <ToolbarSpacer />
        <TouchableOpacity
          style={style.actionButtonContainer}
          onPress={() => this.openModal('camera')}
        >
          <Feather name="camera" color={colors.white} size={24} />
        </TouchableOpacity>
        <ToolbarSpacer />
        <TouchableOpacity
          style={style.actionButtonContainer}
          onPress={() => this.openModal('camera')}
        >
          <Feather name="map-pin" color={colors.white} size={24} />
        </TouchableOpacity>
      </Animated.View>
    )
  }
  public marginBottom: number = ifIphoneX(84, 63)
  public render() {
    const sendIconWrapper = {
      ...style.sendIconWrapper,
      opacity: this.state.sendOpacity,
    }
    const paddingBottom = this.state.toolbarSlideout.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 50],
    })
    const keyboardToolbarHeight = this.state.toolbarSlideout.interpolate({
      inputRange: [0, 1],
      outputRange: [46, 0],
    })
    return (
      <View>
        <View style={style.contentWrapper}>
          {this.renderToolbar({ ...style.toolbar, height: keyboardToolbarHeight })}
          <Animated.View
            style={{
              ...style.inputContainer,
              height: this.state.inputHeight,
            }}
            pointerEvents="box-none"
          >
            <TextInput
              style={style.input}
              value={this.state.text}
              onChangeText={(text: string) => this.onChange(text)}
              onContentSizeChange={(event: any) => {
                this.changeInputHeight(event.nativeEvent.contentSize.height + 24)
              }}
              multiline
              // multiline={this.state.inputFocussed}
              numberOfLines={1}
              blurOnSubmit={false}
              returnKeyType="done"
            />
            <View style={style.sendButtonHelper}>
              <TouchableOpacity onPress={() => this.onSend()}>
                <Animated.View style={sendIconWrapper}>
                  <Feather
                    name="send"
                    color={colors.coralBlue}
                    size={25}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
        <Animated.View
          style={{
            width,
            height: paddingBottom,
          }}
        />
        <Animated.View
          style={{
            ...style.keyboardToolbar,
            // maxHeight: keyboardToolbarHeight,
            transform: [
              { translateY: keyboardToolbarHeight },
            ],
            opacity: this.state.toolbarSlideout,
          }}
        >
          {this.renderToolbar(style.toolbar)}
        </Animated.View>
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

const maxInputHeight = Math.min(height - ifIphoneX(437, 346) - 64, 200)
const style = {
  contentWrapper: {
    marginTop: 4,
    marginLeft: 12,
    marginRight: 12,
    width: width - 24,
    flexDirection: 'column' as 'column',
    borderRadius: 10,
    borderRadiusBottomLeft: 6,
    borderRadiusBottomRight: 6,
    backgroundColor: '#62B8DC',
  },
  actionButtonContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  keyboardToolbar: {
    width,
    height: 46,
    bottom: 0,
    left: 0,
    flexDirection: 'column' as 'column',
    alignItems: 'flex-end' as 'flex-end',
    backgroundColor: '#62B8DC',
    overflow: 'hidden' as 'hidden',
    position: 'absolute' as 'absolute',
  },
  toolbar: {
    flex: 0,
    flexGrow: 0,
    flexDirection: 'row' as 'row',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    overflow: 'hidden' as 'hidden',
  },
  inputContainer: {
    borderRadius: 6,
    minHeight: 43,
    flex: 0,
    flexGrow: 0,
    backgroundColor: colors.white,
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    overflow: 'hidden' as 'hidden',
    maxHeight: maxInputHeight,
  },
  input: {
    ...type.regular,
    color: colors.cosmos,
    lineHeight: 19,
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    maxHeight: maxInputHeight,
  },
  sendButtonHelper: {
    height: '100%',
    flex: 0,
    flexGrow: 0,
    flexDirection: 'column-reverse' as 'column-reverse',
  },
  sendIconWrapper: {
    width: 52,
    height: 43,
    zIndex: 1,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
}

const ToolbarSpacer = () => (
  <View
    style={{
      width: 1,
      flex: 0,
      flexGrow: 0,
      height: 24,
      backgroundColor: colors.shadow,
      opacity: 0.25,
    }}
  />
)
