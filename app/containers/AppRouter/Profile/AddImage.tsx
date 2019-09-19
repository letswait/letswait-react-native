import React from 'react'
import {
  ActionSheetIOS,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import FastImage from 'react-native-fast-image'
import Feather from 'react-native-vector-icons/Feather'
import FeatherButton from '../../../components/Camera/CameraButton'

import { colors, type } from '../../../../new_foundation'

import CameraModal from '../../../components/Camera/Camera'
import CameraRollModal from '../../../components/CameraRoll/CameraRoll'

import { IMediaReference } from '../../../types/photos'

interface IProps {
  source?: IMediaReference | string
  onPhoto: (photo: IMediaReference) => void
  onDelete?: () => void
  height?: number
}
interface IState {
  modalVisible: boolean
  preparedModal: string
  selectedPhoto?: IMediaReference
}
export default class AddImage extends React.PureComponent<IProps,IState> {
  public state: IState = {
    modalVisible: false,
    preparedModal: '',
    selectedPhoto: typeof this.props.source === 'string' ?
      { uri: this.props.source } :
      this.props.source,
  }
  public receiveImages(photo: IMediaReference) {
    this.props.onPhoto(photo)
    this.setState({ selectedPhoto: photo })
    this.closeModal()
  }
  private presentNewImageActionSheet() {
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
  private presentActionSheet() {
    const options = Object.assign(
      [],
      ['Cancel', 'Choose from Library', 'Camera'],
      !!this.props.onDelete ? 'Delete' : undefined,
    )

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        title: 'From where would you like to upload a photo',
        cancelButtonIndex: 0,
        ...(!!this.props.onDelete ? { destructiveButtonIndex: 3 } : null),
      },
      (buttonIndex: number) => {
        switch(buttonIndex) {
          case 1: this.openModal('cameraRoll')
            break
          case 2: this.openModal('camera')
            break
          case 3: this.props.onDelete!()
            break
          default: break
        }
      },
    )
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
  public render() {
    const container = {
      height: this.props.height || 350,
      width: '100%',
    }
    return (
      <View style={container}>
        {this.state.selectedPhoto ? this.state.selectedPhoto.type ? (
          <Image
            source={this.state.selectedPhoto}
            style={container}
          />
        ) : (
          <FastImage
            source={this.state.selectedPhoto}
            style={container}
          />
        ) : (
          <Image
            source={require('../../../assets/ui/ui-profile-blur-1.png')}
            style={container}
          />
        )}
        {this.state.selectedPhoto ? (
          <TouchableOpacity
            style={style.activeEditButton}
            onPress={() => this.presentActionSheet()}
          >
            <Feather
              name="edit"
              size={28}
              color="white"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={style.addImageContainer}
            onPress={() => this.presentNewImageActionSheet()}
          >
            <Text style={style.text}>Add Image </Text>
            <Feather name="plus" color="white" size={32} />
          </TouchableOpacity>
        )}
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
  activeEditButton: {
    position: 'absolute' as 'absolute',
    top: 16,
    right: 16,
    borderRadius: 6,
    backgroundColor: 'transparent',
    shadowColor: colors.cloud,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 8,
  },
  addImageContainer: {
    width: '100%',
    height: 350,
    backgroundColor: colors.cloud,
    left: 0,
    top: 0,
    position: 'absolute' as 'absolute',
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  text: {
    ...type.large,
    color: 'white',
  },
}
