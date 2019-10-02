import * as React from 'react'
import {
  Alert,
  Dimensions,
  LayoutChangeEvent,
  Text,
  View,
} from 'react-native'

const { width, height } = Dimensions.get('window')

import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'

import { colors, type } from '../../../../new_foundation'

import { IMediaReference } from 'app/types/photos'
import { ifIphoneX } from 'react-native-iphone-x-helper'

interface IProps {
  title?: string,
  children?: React.ReactNode,
  source?: IMediaReference
  customHeight?: number
  showGradient?: boolean
}
interface IState {
  height: number
}
export default class CardSection extends React.PureComponent<IProps, IState> {
  public state = {
    // height: this.props.customHeight || width + 64,
    height: this.props.customHeight || this.props.children ? width + 64 : width - 24,
  }
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    return (
      <View
        style={{
          height: this.state.height,
          marginTop: this.props.customHeight ? 0 : 6,
          marginBottom: 6,
          // height: this.state.height,
          // ...(this.props.children ? this.props.source ? {
          //   //Source+Children
          // } : {
          //   //Source Only
          // } : {

          // })
          // ...(this.props.source ? style.imageWrapper : style.wrapper),
          // height: this.state.height,
          // ...(this.props.children ?
          //   null : {
          //     marginTop: 0,
          //     marginBottom: 22,
          //   }),
        }}
      >
        {this.props.source && (
          <View
            style={{
              maxWidth: width,
              maxHeight: this.props.customHeight || width,
              // shadowColor: colors.cosmos,
              // shadowOpacity: 0.12,
              // shadowRadius: 6,
              // shadowOffset: { width: 0, height: 2 },
            }}
          >
            <FastImage
              style={{
                ...(this.props.children ? {
                  height: (this.props.customHeight || width) + 16,
                  width: width + 16,
                  borderRadius: 8,
                  overflow: 'hidden' as 'hidden',
                  transform: [
                    { translateY: -8 },
                    { translateX: -8 },
                  ],
                } : {
                  borderRadius: 24,
                  overflow: 'hidden' as 'hidden',
                  height: width - 24,
                  marginLeft: 12,
                  marginRight: 12,
                }),
              }}
              source={this.props.source}
            >
              {
                (this.props.showGradient || this.props.customHeight) &&
                <LinearGradient
                  colors={[
                    'rgba(33, 33, 33, 1)',
                    'rgba(17, 17, 17, 0.63)',
                    'rgba(0, 0, 0, 0.25)',
                    'rgba(0, 0, 0, 0.10)',
                    'rgba(0, 0, 0, 0)',
                  ]}
                  style={style.gradient}
                />
              }
              {
                this.props.children &&
                <LinearGradient
                  colors={[
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0.10)',
                    'rgba(0, 0, 0, 0.25)',
                    'rgba(17, 17, 17, 0.63)',
                    'rgba(33, 33, 33, 1)',
                  ]}
                  style={style.bottomGradient}
                />
              }
            </FastImage>
          </View>
        )}
        {this.props.children &&
          <View
            style={this.props.source ? style.floatingSectionWrapper : style.sectionWrapper}
            {...(this.props.source ? { onLayout: (e: LayoutChangeEvent) => {
              const minHeight = (this.props.customHeight || width) + 64
              this.setState({
                height: Math.max(minHeight, Math.min(0, e.nativeEvent.layout.height - 64)),
              })
            }} : null)}
          >
            <View style={style.sectionContainer}>
              {this.props.title && <Text style={style.title}>{this.props.title}</Text>}
              {typeof this.props.children === 'string' ?
                <Text style={style.text}>{this.props.children}</Text> :
                this.props.children
              }
            </View>
          </View>
        }
      </View>
    )
  }
}
// interface IProps {
//   title?: string,
//   children: React.ReactNode,
//   source: IMediaReference
// }
// export default class CardSection extends React.PureComponent<IProps> {
//   constructor(props: IProps) {
//     super(props)
//   }
//   public render() {
//     return (
//       <View style={style.sectionContainer}>
//         {this.props.title && <Text style={style.title}>{this.props.title}</Text>}
//         {typeof this.props.children === 'string' ?
//           <Text style={style.text}>{this.props.children}</Text> :
//           this.props.children
//         }
//       </View>
//     )
//   }
// }

const style = {
  gradient: {
    height: 200,
    width: '100%',
    top: 0,
    left: 0,
    opacity: 0.75,
    position: 'absolute' as 'absolute',
  },
  bottomGradient: {
    height: 200,
    width: '100%',
    bottom: 0,
    left: 0,
    opacity: 0.4,
    position: 'absolute' as 'absolute',
  },
  imageWrapper: {
    // paddingBottom: 64,
  },
  wrapper: {
    // paddingTop: 48,
    // paddingBottom: 48,
  },
  sectionWrapper: {
    paddingLeft: 12,
    paddingRight: 12,
    // shadowColor: colors.cosmos,
    // shadowOpacity: 0.18,
    // shadowRadius: 16,
    // shadowOffset: { width: 0, height: 4  },
  },
  floatingSectionWrapper: {
    paddingLeft: 12,
    paddingRight: 12,
    // shadowColor: colors.cosmos,
    // shadowOpacity: 0.06,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 4 },
    position: 'absolute' as 'absolute',
    bottom: 0,
  },
  sectionContainer: {
    width: width - 24,
    flexDirection: 'column' as 'column',
    alignItems: 'stretch' as 'stretch',
    justifyContent: 'center' as 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden' as 'hidden',
  },
  title: {
    ...type.regular,
    color: colors.cosmos,
    marginBottom: 8,
    marginTop: 16,
  },
  text: {
    ...type.regular,
    color: colors.cosmos,
    marginBottom: 16,
  },
}
