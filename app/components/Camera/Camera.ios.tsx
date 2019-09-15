import React from 'react'
import {
  CameraRoll,
  Dimensions,
  Image,
  ImageEditor,
  TouchableOpacity,
  View,
} from 'react-native'
import { CameraType, FlashMode, RNCamera } from 'react-native-camera'

import CameraButton from './CameraButton'

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { colors } from '../../../new_foundation'
import { IMediaReference } from '../../types/photos'

const { width, height } = Dimensions.get('window')

enum CameraStatus {
  NOT_READY = 'NOT_READY',
  READY = 'READY',
  PENDING_PICTURE_APPROVAL = 'PENDING_PICTURE_APPROVAL',
}

interface IProps {
  onClose: () => any
  onSelect: (photo: IMediaReference) => any
}
interface IState {
  direction: any
  flashMode: any
  status: CameraStatus
  picture: string
}
export default class CameraModalIos extends React.Component<IProps, IState> {
  private cameraWrapper: any
  private camera: any
  constructor(props: IProps) {
    super(props)
    this.state = {
      direction: RNCamera.Constants.Type.front,
      flashMode: RNCamera.Constants.FlashMode.auto,
      status: CameraStatus.READY,
      picture: '',
    }
  }
  private toggleFlash() {
    const toggle = { flash: this.state.flashMode }
    switch(toggle.flash) {
      case RNCamera.Constants.FlashMode.on:
        toggle.flash = RNCamera.Constants.FlashMode.auto
        break
      case RNCamera.Constants.FlashMode.auto:
        toggle.flash = RNCamera.Constants.FlashMode.off
        break
      case RNCamera.Constants.FlashMode.off:
        toggle.flash = RNCamera.Constants.FlashMode.on
        break
      default: toggle.flash = RNCamera.Constants.FlashMode.off
    }
    this.setState((prevState) => {
      return {
        ...prevState,
        flashMode: toggle.flash,
      }
    })
  }
  private async takePicture() {
    if(this.camera) {
      const options = { quality: 1, base64: true }
      const data = await this.camera.takePictureAsync(options)
      this.cameraWrapper.measure(
        async (x: number, y: number, w: number, h: number, pageX: number, pageY: number) => {
          const cropData = {
            offset: { x: 0, y: 0 },
            size: { width: data.width, height: Math.floor((data.width * h)/w) },
            displaySize: { width: w, height: h },
          }
          const resizeImage = async (): Promise<string> => {
            return new Promise<string>((resolve, reject) => {
              ImageEditor.cropImage(
                data.uri,
                cropData,
                (uri: string) => resolve(uri),
                () => reject(),
              )
            })
          }
          const resizedUri = await resizeImage()
          this.setState((prevState): IState => {
            return {
              ...prevState,
              status: CameraStatus.PENDING_PICTURE_APPROVAL,
              picture: resizedUri,
            }
          })
        },
      )
    }
  }
  private flipCamera() {
    let direction = this.state.direction
    if(this.state.direction === RNCamera.Constants.Type.front) {
      direction = RNCamera.Constants.Type.back
    } else {
      direction = RNCamera.Constants.Type.front
    }
    this.setState((prevState) => {
      return {
        ...prevState,
        direction,
      }
    })
  }
  private async approvePicture() {
    const newURI = await CameraRoll.saveToCameraRoll(this.state.picture)
    this.props.onSelect({ uri: newURI, type: 'ALAssetTypePhoto' })
  }
  private denyPicture() {
    this.setState((prevState): IState => {
      return {
        ...prevState,
        status: CameraStatus.READY,
        picture: '',
      }
    })
  }
  public render() {
    const StatelyRender = {
      NOT_READY: (
        <View/>
      ),
      PENDING_PICTURE_APPROVAL: (
        <View style={style.screen}>
          <View style={style.topContainer}>
            <CameraButton
              style={style.close}
              name={'x'}
              size={32}
              color={colors.white}
              onPress={() => this.props.onClose()}
            />
          </View>
          {console.log(this.state.picture)}
          {this.state.picture ? <Image
            style={style.cameraWrapper}
            source={{ uri: this.state.picture }}
          /> : null}
          <View style={style.bottomContainer}>
            <CameraButton
              style={style.aperture}
              name={'x'}
              size={48}
              color={colors.duckbill}
              onPress={() => this.denyPicture()}
            />
            <CameraButton
              style={style.aperture}
              name={'check'}
              size={48}
              color={colors.seafoam}
              onPress={() => this.approvePicture()}
            />
          </View>
        </View>
      ),
      READY: (
        <View style={style.screen}>
          <View style={style.topContainer}>
            <CameraButton
              style={style.close}
              name={'x'}
              size={32}
              color={colors.white}
              onPress={() => this.props.onClose()}
            />
          </View>
          <View
            ref={(component: any) => {
              this.cameraWrapper = component
            }}
            style={style.cameraWrapper}
          >
            <RNCamera
              ref={(component: any) => {
                this.camera = component
              }}
              style={style.camera}
              type={this.state.direction}
              flashMode={this.state.flashMode}
              autoFocus={RNCamera.Constants.AutoFocus.on}
              permissionDialogTitle={'Camera Permission'}
              permissionDialogMessage={'Let\'s Wait needs your permission to access the camera'}
              onFaceDetectionError={() => console.log('couldnt detect face!')}
              onFacesDetected={(faceArray) => {
                console.log(faceArray)
              }}
            />
          </View>
          <View style={style.bottomContainer}>
            <CameraButton
              style={style.flash}
              name={
                (this.state.flashMode === RNCamera.Constants.FlashMode.on ||
                this.state.flashMode === RNCamera.Constants.FlashMode.auto) ?
                'zap' : 'zap-off'
              }
              size={32}
              color={
                (this.state.flashMode === RNCamera.Constants.FlashMode.on) ?
                '#E2E52D' : colors.white
              }
              onPress={() => this.toggleFlash()}
            />
            <CameraButton
              style={style.aperture}
              name={'aperture'}
              size={64}
              color={colors.white}
              onPress={() => this.takePicture()}
            />
            <CameraButton
              style={style.flip}
              name={'refresh-cw'}
              size={32}
              color={colors.white}
              onPress={() => this.flipCamera()}
            />
          </View>
        </View>
      ),
    }
    console.log(this.state.status)
    return (StatelyRender as any)[this.state.status]
  }
}

const style = {
  screen: {
    ...ifIphoneX(
      {
        paddingTop: 44,
        paddingBottom: 25,
      },
      {
        paddingTop: 20,
        paddingBottom: 5,
      },
    ),
    backgroundColor: 'black',
    width: '100%',
    display: 'flex' as 'flex',
    height: '100%',
    flexDirection: 'column' as 'column',
  },
  topContainer: {
    flex: 0,
    width: '100%',
    height: 70,
  },
  close: {
    width: 70,
  },
  camera: {
    height: '100%',
    width: '100%',
  },
  cameraWrapper: {
    flex: 1,
    width: '100%',
  },
  bottomContainer: {
    width: '100%',
    flex: 0,
    flexDirection: 'row' as 'row',
    display: 'flex' as 'flex',
    height: 100,
  },
  flash: {
  },
  aperture: {
    flex: 1,
  },
  flip: {
  },
}
