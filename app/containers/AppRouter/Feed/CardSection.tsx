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
import BuoyantContainer from '../../../components/BuoyantContainer';
import DynamicListContainer from '../../../components/DynamicListContainer';

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
  private dynamicImageContainer: any
  private dynamicCardContainer: any
  public state = {
    height: this.props.customHeight || this.props.children ? width + 64 : width - 24,
  }
  constructor(props: IProps) {
    super(props)
  }
  public onScroll(toValue: number, delay: number, duration: number = 300) {
    if(this.dynamicImageContainer) {
      if (this.props.children) {
        this.dynamicImageContainer.onScroll(toValue, delay, 600)
      } else {
        this.dynamicImageContainer.onScroll(toValue, delay, 200)
      }
    }
    if(this.dynamicCardContainer) {
      this.dynamicCardContainer.onScroll(toValue, delay, 200)
    }
  }
  public render() {
    const imageWrapper = this.props.children ? {
      // maxWidth: width,
      // maxHeight: this.props.customHeight || width,
      height: (this.props.customHeight || width) + 16,
      width: width + 16,
      borderRadius: 8,
      left: -8,
      top: -8,
      overflow: 'hidden' as 'hidden',
    } : {
      borderRadius: 24,
      overflow: 'hidden' as 'hidden',
      height: width - 24,
      marginLeft: 12,
      marginRight: 12,
    }
    const imageContainer = this.props.children ? {
      height: (this.props.customHeight || width) + 16,
      width: width + 16,
      // transform: [{ scale: 1.1 }],
    } : {
      height: width - 24,
    }
    const imageStyle = this.props.children ? {
      height: (this.props.customHeight || width) + 16,
      width: width + 16,
    } : {
      height: width - 24,
    }
    const marginTop = this.props.customHeight ? 0 : 6
    return (
      <View
        style={{
          marginTop,
          height: this.state.height,
          marginBottom: 6,
        }}
      >
        {this.props.source && (
          <DynamicListContainer
            vertical={true}
            ref={c => this.dynamicImageContainer = c}
            maxOffset={8}
            style={imageWrapper}
          >
            <View
              // maxOffset={16}
              style={imageContainer}
            >
              <FastImage
                style={imageStyle}
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
          </DynamicListContainer>
        )}
        {this.props.children &&
          <DynamicListContainer
            vertical={true}
            maxOffset={8}
            ref={c => this.dynamicCardContainer = c}
            style={this.props.source ? style.floatingSectionWrapper : style.sectionWrapper}
          >
          <View
            style={{
              // ...(this.props.source ? style.floatingSectionWrapper : style.sectionWrapper),
              // width: width - 24,
              // flexDirection: 'column' as 'column',
              // alignItems: 'stretch' as 'stretch',
              // justifyContent: 'center' as 'center',
              borderRadius: 18,
              overflow: 'hidden' as 'hidden',
            }}
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
          </DynamicListContainer>
        }
      </View>
    )
  }
}

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
  sectionWrapper: {
    paddingLeft: 12,
    paddingRight: 12,
    width: width - 24,
  },
  floatingSectionWrapper: {
    left: 12,
    width: width - 24,
    position: 'absolute' as 'absolute',
    bottom: 0,
  },
  sectionContainer: {
    width: width - 24,
    backgroundColor: colors.white,
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
