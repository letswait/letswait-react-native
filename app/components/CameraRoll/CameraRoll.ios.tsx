import React from 'react'
import {
  Alert,
  Animated,
  CameraRoll,
  Dimensions,
  Easing,
  FlatList,
  GetPhotosParamType,
  GetPhotosReturnType,
  Image,
  LinkingIOS,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import { colors, spacing, type } from '../../../foundation'
import {
  CameraRollRow,
  IMediaReference,
  IPhoto,
} from '../../types/photos'

import BackButton from '../../components/Buttons/BackButton'
import CameraRollImageRow from './CameraRollImageRow'

const { height, width } = Dimensions.get('window')
const third = width / 3

interface IProps {
  onClose: () => any;
  onSelect: (photo: IMediaReference) => any;
  mediaType?: 'Photos' | 'Videos' | 'All'
  approveLabel?: string
}
interface IState {
  cameraRollVisible: boolean;
  cameraRoll: CameraRollRow[];
  selectedMedia?: IMediaReference;
  refreshing: boolean;
  preview?: IMediaReference;
  previewWindow: any;
  soundPlaying: boolean;
  previewHeight: number;
  previewReady: boolean;
  hasAsked: boolean;
}
export default class CameraRollModalIos extends React.Component<IProps, IState> {
  private mounted = true
  private maximumVisibleRows = Math.floor(height / third) + 1
  constructor(props: any) {
    super(props)
    this.state = {
      cameraRollVisible: false,
      cameraRoll: [],
      refreshing: false,
      previewWindow: new Animated.Value(0),
      soundPlaying: false,
      previewHeight: 300,
      previewReady: false,
      hasAsked: false,
    }
  }
  public componentDidMount() {
    this.checkPermissions()
  }
  private checkPermissions() {
    this.loadCameraRoll()
    // Permissions.check('photo').then((res) => {
    //   switch(res) {
    //     case 'authorized': this.loadCameraRoll()
    //       break
    //     case 'undetermined': this.requestPermission()
    //       break
    //     case 'restricted':
    //       Alert.alert(
    //         'Permission Denied',
    //         'Restrictions on this device prevent the camera roll from being accessed',
    //       )
    //       this.props.onClose()
    //       break
    //     case 'denied':
    //       try {
    //         if(this.state.hasAsked) throw new Error('Could not retrieve camera roll permissions.')
    //         Alert.alert(
    //           'Permission Denied',
    //           'Turn on Camera Roll access through Settings',
    //           [
    //             { text: 'Cancel', onPress:() => this.props.onClose(), style: 'cancel' },
    //             { text: 'Open Settings', onPress: () => {
    //               LinkingIOS.canOpenURL('app-settings:', (supported) => {
    //                 if(supported) {
    //                   this.setState({ hasAsked: true })
    //                   LinkingIOS.openURL('app-settings:')
    //                   setTimeout(() => this.checkPermissions(), 1500)
    //                 } else {
    //                   throw new Error('Could not navigate to Settings')
    //                 }
    //               })
    //             }},
    //           ],
    //         )
    //       } catch (e) {
    //         Alert.alert('Permission Denied', e.message)
    //         this.props.onClose()
    //       }
    //   }
    // })
  }
  private requestPermission() {
    this.loadCameraRoll()
    // Permissions.request('photo').then((res) => {
    //   if(res === 'authorized') {
    //     this.loadCameraRoll()
    //   } else {
    //     Alert.alert('You can turn on Camera Roll access later in the Settings app')
    //     this.props.onClose()
    //   }
    // })
  }
  private async loadCameraRoll() {
    await this.setState((prevState) => {
      return {
        ...prevState,
        cameraRoll: [],
        refreshing: true,
      }
    })
    let cont = true
    let current_page = null
    while (cont) {
      const options: GetPhotosParamType = {
        first: 36,
        assetType: this.props.mediaType || 'Photos',
        groupTypes: 'All',
      }
      if (current_page && current_page !== null) {
        options.after = current_page
      }
      const { edges, page_info }: GetPhotosReturnType = await CameraRoll.getPhotos(options)
      if (this.mounted) {
        this.setState((prevState, props): IState => {
          let rows: CameraRollRow[] = []
          let newRow: CameraRollRow
          for (let i = 0; i < edges.length; i += 3) {
            newRow = [edges[i]]
            if (typeof edges[i + 1] === 'object') {
              newRow = newRow.concat([edges[i+1]])
              if (typeof edges[i + 2] === 'object') {
                newRow = newRow.concat([edges[i + 2]])
              }
            }
            rows = rows.concat([newRow])
          }
          const newCameraRoll: CameraRollRow[] = [...prevState.cameraRoll, ...rows]
          if (page_info.has_next_page) {
            current_page = page_info.end_cursor
          } else {
            cont = false
          }
          return {
            ...prevState,
            cameraRoll: newCameraRoll,
            cameraRollVisible: true,
            refreshing: false,
          }
        })
      }
    }
  }
  public selectImage(uri: string, mediaType: string) {
    this.setState((prevState: IState): IState => {
      return {
        ...prevState,
        selectedMedia: { uri, type: mediaType },
      }
    })
  }

  private renderCameraRollOverlay(children: any) {
    return (
      <View style={style.screen}>
        <View style={style.header}>
          <View style={style.headerTitleWrapper}>
            <View style={style.headerTitleContainer}>
              <Text style={style.headerTitle}>
                {this.props.mediaType === 'All' ?
                  'Photo Library' :
                  this.props.mediaType || 'Photos'
                }
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={style.headerOptionWrapperLeft}
            onPress={() => this.props.onClose()}
          >
            <Text style={style.headerOptionText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.headerOptionWrapperRight}
            onPress={() => this.props.onSelect(this.state.selectedMedia!)}
            disabled={!this.state.selectedMedia}
          >
            <Text style={style.headerOptionText}>
              {this.props.approveLabel || 'Select'}
            </Text>
          </TouchableOpacity>
        </View>
        {children}
        <View
          style={style.previewWrapper}
          pointerEvents="none"
        >
          <Animated.View
            style={{
              ...style.previewWindow,
              transform: [{ scale: this.state.previewWindow }],
            }}
          >
            { this.state.preview ?
              <Image
                source={{ uri: this.state.preview.uri }}
                style={{
                  height: this.state.previewHeight,
                  width: 300,
                }}
                onLoad={() => {
                  Image.getSize(
                    this.state.preview!.uri,
                    (imageWidth, imageHeight) => {
                      this.setState((prevState): IState => {
                        if(prevState.previewReady) {
                          this.openPreviewAnimation()
                        }
                        return {
                          ...prevState,
                          previewHeight: (300 * imageHeight) / imageWidth,
                        }
                      })
                    },
                    () => {
                      return
                    },
                  )
                }}
                resizeMode={'contain'}
              />
            :  null
          }
          </Animated.View>
        </View>
      </View>
    )
  }
  private setupPreview = (uri: string, mediaType: string) => {
    this.setState((prevState): IState => {
      return {
        ...prevState,
        preview: { uri, type: mediaType },
        previewReady: prevState.preview && prevState.preview!.uri === uri ? true : false,
      }
    })
  }
  private openPreview = () => {
    this.setState((prevState): IState => {
      if(prevState.previewReady) {
        this.openPreviewAnimation()
      }
      return {
        ...prevState,
        soundPlaying: true,
        previewReady: true,
      }
    })
  }
  private openPreviewAnimation = () => {
    Animated.timing(this.state.previewWindow, {
      toValue: 1,
      duration: 300,
      // easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start()
  }
  private closePreview = () => {
    this.setState((prevState): IState => {
      return {
        ...prevState,
        soundPlaying: false,
      }
    })
    Animated.timing(this.state.previewWindow, {
      toValue: 0,
      duration: 300,
      // easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start()
  }
  private _getCameraRollRowLayout = (data: any, index: number) => ({
    index,
    length: third,
    offset: third * index,
  })
  private renderRow = (item: any, index: number) => {
    const isSelected: [] = !!this.state.selectedMedia ? item.map((imageItem: IPhoto) => {
      if(!imageItem) return false
      const { uri } = imageItem.node.image
      return (this.state.selectedMedia!.uri === uri)
    }): [false, false, false]
    return (
      <CameraRollImageRow
        data={item}
        row={index <= this.maximumVisibleRows}
        onPress={(imageURI: string, mediaType: string) => this.selectImage(imageURI, mediaType)}
        onPressIn={(imageURI: string, mediaType: string) => this.setupPreview(imageURI, mediaType)}
        onPressOut={() => this.closePreview()}
        onPreview={() => this.openPreview()}
        isSelected={isSelected}
      />
    )
  }
  public componentWillUnmount() {
    this.mounted = false
  }
  public render() {
    const statelyRender = {
      NOT_READY: (
        <View
          style={{
            width: '100%',
            flex: 1,
            display: 'flex' as 'flex',
            justifyContent: 'center' as 'center',
            alignItems: 'center' as 'center',
          }}
        >
          <Text>No Images Available</Text>
        </View>
      ),
      READY: (
        <FlatList
          data={this.state.cameraRoll}
          renderItem={({ item, index }) => this.renderRow(item, index)}
          onRefresh={() => {
            this.loadCameraRoll()
          }}
          refreshing={this.state.refreshing}
          extraData={this.state.selectedMedia}
          removeClippedSubviews={true}
          keyExtractor={(item, i) => `${i}`}
          getItemLayout={this._getCameraRollRowLayout}
          initialNumToRender={this.maximumVisibleRows}
          style={{ flex: 1 }}
        />
      ),
    }
    return this.renderCameraRollOverlay(
      this.state.cameraRollVisible ?
        statelyRender.READY :
        statelyRender.NOT_READY,
    )
  }
}

const style = {
  screen: {
    width: '100%',
    height: '100%',
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    ...ifIphoneX(
      { paddingTop: 44 },
      { paddingTop: 20 },
    ),
    backgroundColor: colors.white,
  },
  header: {
    height: 50,
    width: '100%',
    flexDirection: 'row' as 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.wisteria,
    display: 'flex' as 'flex',
  },
  headerChevron: {
    position: 'absolute' as 'absolute',
    left: -24,
  },
  headerChevronWrapper: {
    height: 24,
    flex: 0,
    width: 0,
  },
  headerTitleWrapper: {
    flexDirection: 'row' as  'row',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    display: 'flex' as 'flex',
    height: 45,
    marginTop: 5,
    flex: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row' as  'row',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    display: 'flex' as 'flex',
    flex: 0,
  },
  headerTitle: {
    ...type.large,
    fontWeight: '700' as '700',
    color: colors.wisteria,
  },
  headerOptionWrapperLeft: {
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    position: 'absolute' as 'absolute',
    height: 50,
    left: 0,
    top: 0,
  },
  headerOptionWrapperRight: {
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    position: 'absolute' as 'absolute',
    height: 50,
    right: 0,
    top: 0,
  },
  headerOptionText: {
    ...type.regular,
    padding: spacing.small,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  contentInner: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
  },
  previewWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute' as 'absolute',
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'column' as  'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    shadowColor: '#000000',
    shadowRadius: 6,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 10 },
  },
  previewWindow: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden' as 'hidden',
  },
}
