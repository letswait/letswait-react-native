import React from 'react'
import {
  Animated,
  Easing,
  Keyboard,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { ifIphoneX } from 'react-native-iphone-x-helper'

import Feather from 'react-native-vector-icons/Feather'
import { colors, spacing, type } from '../../../foundation'
import { IMediaReference } from '../../types/photos';

import CameraModal from '../Camera/Camera'
import CameraRollModal from '../CameraRoll/CameraRoll'

interface IProps {
  onSend: (message: string) => any,
  onSendImage: (photo: IMediaReference) => any,
}
interface IState {
  message: string
  modalVisible: boolean
  preparedModal: 'camera' | 'cameraRoll' | ''
  keyboardVisible: Animated.Value
}
export default class ChatInput extends React.PureComponent<IProps, IState> {
  public keyboardDidShowListener: any
  public keyboardDidHideListener: any
  constructor(props: IProps) {
    super(props)
    this.state = {
      message: '',
      modalVisible: false,
      preparedModal: '',
      keyboardVisible: new Animated.Value(0),
    }
  }
  public componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => this.keyboardDidShow(),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => this.keyboardDidHide(),
    );
  }
  public componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  public keyboardDidShow() {
    Animated.timing(this.state.keyboardVisible, {
      toValue: 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start()
    // this.setState({ keyboardVisible: true })
  }
  public keyboardDidHide() {
    Animated.timing(this.state.keyboardVisible, {
      toValue: 0,
      duration: 300,
    }).start()
  }
  public openModal(name: 'camera' | 'cameraRoll' | '') {
    if(!this.state.modalVisible && name && !!name.length) {
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
    if(this.state.message) {
      this.props.onSend(this.state.message)
      this.setState({ message: '' })
    }
  }
  public render() {
    const sendIconWrapper = {
      ...style.sendIconWrapper,
      opacity: this.state.message ? 1 : 0.4,
    }
    const container = {
      ...style.container,
      ...ifIphoneX({
        marginBottom: this.state.keyboardVisible.interpolate({
          inputRange: [0, 1],
          outputRange: [40, 0],
          extrapolate: 'clamp',
        }),
        // marginBottom: this.state.keyboardVisible ? 12 : 40,
      },           {
        marginBottom: this.state.keyboardVisible.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
          extrapolate: 'clamp',
        }),
      }),
    }
    return (
      <Animated.View style={container}>
        <View style={style.topBar}/>
        <View style={style.contentWrapper}>
          <TouchableOpacity
            style={style.actionButtonContainer}
            onPress={() => this.openModal('camera')}
          >
            <Feather name="camera" color={colors.white} size={20}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.actionButtonContainer}
            onPress={() => this.openModal('cameraRoll')}
          >
            <Feather name="image" color={colors.white} size={20}/>
          </TouchableOpacity>
          <View style={style.inputContainer} pointerEvents="box-none">
            <TextInput
              style={style.input}
              value={this.state.message}
              onChangeText={(text: string) => this.onChange(text)}
              multiline
              numberOfLines={1}
            />
            <TouchableOpacity
              style={sendIconWrapper}
              onPress={() => this.onSend()}
            >
              <Feather
                name="send"
                color={'#A372E2'}
                size={spacing.base}
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
                approveLabel="Send"
                mediaType="All"
              />
            ),
          } as any)[this.state.preparedModal]}
        </Modal>
      </Animated.View>
    )
  }
}

const style = {
  container: {
    width: '100%',
    flexDirection: 'column' as 'column',
  },
  topBar: {
    height: 1,
    width: '100%',
    backgroundColor: colors.lilac,
  },
  contentWrapper: {
    padding: spacing.tiny,
    flexDirection: 'row' as 'row',
    width: '100%',
    alignItems: 'flex-end' as 'flex-end',
  },
  actionButtonContainer: {
    width: 46,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#A372E2',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    marginRight: spacing.tiny,
  },
  inputContainer: {
    borderRadius: 17,
    flex: 1,
    backgroundColor: colors.white,
    borderColor: '#A372E2',
    borderWidth: 1,
    flexDirection: 'row' as 'row',
    alignItems: 'flex-end' as 'flex-end',
  },
  input: {
    ...type.small,
    color: colors.cosmos,
    margin: 7,
    marginTop: 2,
    marginLeft: spacing.tiny,
    marginRight: spacing.tiny,
    flex: 1,
    maxHeight: 300,
  },
  sendIconWrapper: {
    padding: 4,
    paddingRight: 8,
    zIndex: 1,
  },
}
