import React from 'react'
import {
  Alert,
  Text,
  View,
} from 'react-native'

import ActionButton from '../../../components/Buttons/ActionButton'

import { colors, type } from '../../../../new_foundation'

import SetupWrapper from '../SetupWrapperComponent'

import SelectPhoto from '../../../components/Buttons/SelectPhoto'
import { photoUpload } from '../../../lib/api'
import { IMediaReference } from '../../../types/photos'

import RNHeicConverter from 'react-native-heic-converter'

interface IProps {
  path: string
  currentRoute: number
  routes: string[]
  errorMessage?: string
  photos?: string[]
  incrementRoute: () => any
  change: (changes: any) => any
  push: (route: string) => any
  updateProfile: () => any
  postingProfile: boolean
}
interface IState {
  photos: Array<IMediaReference | undefined>
  disabled: boolean
  loading: boolean
}
/** @todo SelectPhoto should be able to select many images, and auto-fill depending on its position in the grid
 * eg: n=2 pic_count= 4 => fill 2 <= n <=5
 * eg: n=5 pic_count_max= 1 => fill n = 5
 */
export default class PhotosComponent extends React.PureComponent<IProps, IState> {
  public state: IState
  constructor(props: IProps) {
    super(props)
    this.state = {
      photos: new Array(6).fill(undefined),
      disabled: true,
      loading: false,
    }
  }
  public componentDidMount() {
    this.props.change({ photos: new Array(6).fill(undefined) })
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // Change in Props
      if(
        this.props.photos &&
        !this.shouldDisable(this.props.photos) &&
        prevProps.photos !== this.props.photos
      ) {
        this.props.incrementRoute()
      } else if(prevProps.currentRoute !== this.props.currentRoute) {
        if(this.props.currentRoute >= this.props.routes.length) {
          this.props.updateProfile()
        } else {
          this.props.push(this.props.routes[this.props.currentRoute])
        }
      }
    }
  }
  private shouldDisable(photos: Array<IMediaReference | string | undefined>) {
    let photoCount = 0
    for(let i = photos.length; i--;) {
      if(photos[i] !== undefined) photoCount += 1
    }
    return photoCount < 3
  }
  private async postPhotos() {
    this.setState({ loading: true })
    const { photos } = this.state
    for(let i = photos.length; i--;) {
      if(photos[i] === undefined) {
        photos.splice(i, 1)
      } else if(photos[i]!.type === 'image/heic') {
        photos[i] = await this.convertPhoto(photos[i]!)
      }
    }

    photoUpload(
      '/api/upload/image/profile',
      photos as IMediaReference[],
      true,
      (progress, event) => {
        console.log('photo upload progress: ', progress)
      }).then(({ err, errorMessage, urls }) => {
        this.setState({ loading: false })
        if(err || urls.length < 3) {
          Alert.alert('Could not finish uploading Photos, try again later.')
        } else {
          this.props.change({ photos: urls })
        }
      })
  }
  public async convertPhoto(photo: IMediaReference) {
    return await RNHeicConverter
      .convert({ // options
        path: photo.uri,
        quality: 0,
      })
      .then((result: any) => {
        return { uri: result.path, type: 'image/jpeg' }
      })
      // .then((result: any) => {
      //   this.props.showToast(`Converted HEIC: ${result} ${photo}`)
      //   photoUpload(
      //     '/api/upload/image/profile',
      //     [{ uri: result.path, type: 'image/jpeg' }],
      //     true,
      //     (progress, event) => {
      //       this.setState((prevState) => {
      //         return {
      //           ...prevState,
      //           photoProgress: Object.assign(
      //             [],
      //             prevState.photoProgress,
      //             { [index]: progress },
      //           ),
      //         }
      //       })
      //       console.log('photo upload progress: ', progress)
      //     }).then(({ err, errorMessage, urls }) => {
      //       if (err || !urls || !urls.length) {
      //         Alert.alert('Could not finish uploading Photos, try again later.')
      //       } else {
      //         this.pushPhoto({ uri: urls[0] }, index)
      //       }
      //     })
      // });
  }
  private setPhoto(photo: IMediaReference, index: number) {
    console.log('setting photo: ', photo, index)
    this.setState(
      (prevProps) => {
        const { photos } = prevProps
        photos[index] = photo
        const disabled = this.shouldDisable(photos)
        return {
          disabled,
          ...{ photos },
        }
      },
      () => console.log('State: ', this.state),
    )
  }
  private clearPhoto(index: number) {
    console.log('clearing photo: ', index)
    this.setState((prevProps) => {
      const { photos } = prevProps
      photos[index] = undefined
      return {
        photos,
        disabled: true,
      }
    })
  }
  public render() {
    return (
      <SetupWrapper>
        <Text style={style.title}>
          Show off your beautiful smile!
        </Text>
        <View style={style.contentWrapper}>
          <SelectPhoto
            style={{ ...style.selectPhoto, ...style.firstRow }}
            onPhoto={photo => this.setPhoto(photo, 0)}
            onDelete={() => this.clearPhoto(0)}
          />
          <SelectPhoto
            style={{ ...style.selectPhoto, ...style.firstRow }}
            onPhoto={photo => this.setPhoto(photo, 1)}
            onDelete={() => this.clearPhoto(1)}
          />
          <SelectPhoto
            style={{ ...style.selectPhoto, ...style.firstRow }}
            onPhoto={photo => this.setPhoto(photo, 2)}
            onDelete={() => this.clearPhoto(2)}
          />
          <SelectPhoto
            style={style.selectPhoto}
            onPhoto={photo => this.setPhoto(photo, 3)}
            onDelete={() => this.clearPhoto(3)}
          />
          <SelectPhoto
            style={style.selectPhoto}
            onPhoto={photo => this.setPhoto(photo, 4)}
            onDelete={() => this.clearPhoto(4)}
          />
          <SelectPhoto
            style={style.selectPhoto}
            onPhoto={photo => this.setPhoto(photo, 5)}
            onDelete={() => this.clearPhoto(5)}
          />
        </View>
        {/* <View style={style.tipWrapper}>
          <View style={style.tipContainer}>
            <View style={style.textBody}>
              <Text style={style.header}>
                You Look Great
              </Text>
              <Text style={style.text}>
                Try not to obscure your face or apply any filters. Express the real you!
              </Text>
            </View>
            <View style={style.textBody}>
              <Text style={style.header}>
                Look Approachable
              </Text>
              <Text style={style.text}>
                Don’t wear your pajamas and avoid bathroom selfies.
                Dress as you would want to be seen in real life.
              </Text>
            </View>
            <View style={style.textBody}>
              <Text style={style.header}>
                Set the Scene
              </Text>
              <Text style={style.text}>
                Avoid bathroom mirror selfies and nightlife pics. First impressions are important.
              </Text>
            </View>
          </View>
        </View> */}
        <ActionButton
          onPress={() => this.postPhotos()}
          disabled={this.state.disabled}
          loading={this.props.postingProfile  || this.state.loading}
        >
          Next
        </ActionButton>
      </SetupWrapper>
    )
  }
}

const style = {
  title: {
    ...type.large,
    color: colors.white,
    marginTop: 24,
    marginBottom: 40,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'space-between' as 'space-between',
    width: 310,
  },
  dateButtonWrapper: {
    width: 275,
  },
  featherIcon: {
    lineHeight: 40,
    height: 40,
    marginRight: 16,
  },
  selectPhoto: {
    flexGrow: 0.33,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  firstRow: {
    marginBottom: 16,
  },
  tipWrapper: {
    flex: 0,
    paddingTop: 16,
    paddingBottom: 16,
  },
  tipContainer: {
    borderRadius: 12,
    width: 331,
    backgroundColor: colors.white,
    borderWidth: 2,
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'column' as 'column',
  },
  textBody: {
    flex: 0,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'column' as 'column',
  },
  header: {
    ...type.regular,
    fontWeight: '600' as '600',
    flex: 0,
    color: colors.cosmos,
  },
  text: {
    ...type.small,
    fontWeight: '400' as '400',
    color: colors.shadow,
    flex: 0,
  },
}
