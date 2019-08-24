import React from 'react'
import {
  Animated,
  Easing,
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
  modalVisible: boolean,
  preparedModal: 'camera' | 'cameraRoll' | ''
}
export default class ChatInput extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      message: '',
      modalVisible: false,
      preparedModal: '',
    }
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
  public render() {
    return (
      <View style={style.container}>
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
          <View style={style.inputContainer}>
            <TextInput
              style={style.input}
              value={this.state.message}
              onChangeText={(text: string) => this.onChange(text)}
              multiline
              numberOfLines={1}
            />
            <TouchableOpacity
              style={style.sendIconWrapper}
              onPress={() => this.props.onSend(this.state.message)}
            >
              <Feather
                name="send"
                color={colors.wisteria}
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
      </View>
    )
  }
}

const style = {
  container: {
    width: '100%',
    flexDirection: 'column' as 'column',
    ...ifIphoneX({
      marginBottom: 24,
    },           {
      marginBottom: 4,
    }),
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
    width: 40,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.wisteria,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    marginRight: spacing.tiny,
  },
  inputContainer: {
    borderRadius: 17,
    flex: 1,
    backgroundColor: colors.white,
    borderColor: colors.wisteria,
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
    margin: 4,
    marginLeft: 0,
    marginRight: spacing.tiny,
  },
}
