import React from 'react'
import {
  Alert,
  Text,
  View,
} from 'react-native'

import moment, { Moment } from 'moment'
import DatePicker from 'react-native-datepicker'

import ActionButton from '../../../components/Buttons/ActionButton'

import Feather from 'react-native-vector-icons/Feather'
import { colors, spacing, type } from '../../../../foundation'

import SetupWrapper from '../SetupWrapperComponent'

import SelectPhoto from '../../../components/Buttons/SelectPhoto'
import { photoUpload } from '../../../lib/api'
import { ObjectOf } from '../../../types/helpers'
import { IMediaReference } from '../../../types/photos'

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
}
interface IState {
  photos: Array<IMediaReference | undefined>
  disabled: boolean
}
/** @todo SelectPhoto should be able to select many images, and auto-fill depending on its position in the grid
 * eg: n=2 pic_count= 4 => fill 2 <= n <=5
 * eg: n=5 pic_count_max= 1 => fill n = 5
 */
export default class BirthdayComponent extends React.Component<IProps, IState> {
  public state: IState
  constructor(props: IProps) {
    super(props)
    this.state = {
      photos: new Array(6).fill(undefined),
      disabled: true,
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
  private postPhotos() {
    const { photos } = this.state
    for(let i = photos.length; i--;) {
      if(photos[i] === undefined) {
        photos.splice(i, 1)
      }
    }
    photoUpload(
      '/api/upload/image/profile',
      photos as IMediaReference[],
      true,
      (progress, event) => {
        console.log('photo upload progress: ', progress)
      }).then(({ err, errorMessage, urls }) => {
        if(err || urls.length < 3) {
          Alert.alert('Could not finish uploading Photos, try again later.')
        } else {
          this.props.change({ photos: urls })
        }
      })
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
        <View style={style.tipWrapper}>
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
        </View>
        <ActionButton
          onPress={() => this.postPhotos()}
          disabled={this.state.disabled}
        >
          Next
        </ActionButton>
      </SetupWrapper>
    )
  }
}

const style = {
  title: {
    ...type.title3,
    color: colors.white,
    marginTop: spacing.base,
    marginBottom: spacing.base+spacing.small,
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
    marginRight: spacing.small,
  },
  selectPhoto: {
    flexGrow: 0.33,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  firstRow: {
    marginBottom: spacing.small,
  },
  tipWrapper: {
    flex: 0,
    paddingTop: 16,
    paddingBottom: 16,
  },
  tipContainer: {
    borderRadius: 12,
    width: 331,
    backgroundColor: 'rgba(131, 99, 173, 0.7)',
    borderColor: '#AC8DD5',
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
    color: colors.white,
  },
  text: {
    ...type.small,
    fontWeight: '400' as '400',
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 0,
  },
}
