import React from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { IPhoto } from '../../types/photos';

import Feather from 'react-native-vector-icons/Feather'
import { colors, spacing, type } from '../../../foundation'

const { height, width } = Dimensions.get('window')

const third = width/3

interface IProps {
  data: IPhoto;
  col: number;
  row: number;
  onPress: (imageURI: string, type: string) => any;
  onPreview: () => any;
  onPressIn: (imageURI: string, type: string) => any;
  onPressOut: () => any;
  active: boolean;
}
interface IState {
  animationProgress: Animated.Value;
  animationDelay: number;
  selectionAnimation: Animated.Value;
}
export default class CameraRollImage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const row = props.row
    const col = props.col
    this.state = {
      animationProgress: new Animated.Value(this.props.row <= 8 ? 0 : 1),
      animationDelay: ((row+col)*40) + 500,
      selectionAnimation: new Animated.Value(1),
    }
  }
  public shouldComponentUpdate(nextProps: IProps) {
    return nextProps.active !== this.props.active
  }
  public componentDidMount() {
    if(this.props.row <= 8) {
      this.initialAnimation()
    }
  }
  public componentWillUpdate(nextProps: IProps, nextState: IState) {
    if(nextProps.active !== this.props.active) {
      if(nextProps.active) {
        this.shrinkAnimation()
      } else {
        this.growAnimation()
      }
    }
  }
  public initialAnimation() {
    Animated.timing(
      this.state.animationProgress,
      {
        toValue: 1,
        duration: 200,
        delay: this.state.animationDelay,
        // easing: Easing.quad,
        useNativeDriver: true,
      },
    ).start()
  }
  public growAnimation() {
    Animated.parallel([
      Animated.timing(
        this.state.selectionAnimation,
        {
          toValue: 1,
          duration: 150,
          // easing: Easing.quad,
          useNativeDriver: true,
        },
      ),
      Animated.timing(
        this.state.animationProgress,
        {
          toValue: 1,
          duration: 200,
          // easing: Easing.quad,
          useNativeDriver: true,
        },
      ),
    ]).start()
  }
  public shrinkAnimation() {
    Animated.parallel([
      Animated.timing(
        this.state.selectionAnimation,
        {
          toValue: 0,
          duration: 150,
          // easing: Easing.quad,
          useNativeDriver: true,
        },
      ),
      Animated.timing(
        this.state.animationProgress,
        {
          toValue: 0.9,
          duration: 200,
          // easing: Easing.quad,
          useNativeDriver: true,
        },
      ),
    ]).start()
  }
  public render() {
    const image = Object.assign({}, style.image, {
      transform: [
        { scale: this.state.animationProgress },
      ],
    })
    return (
      <View style={style.wrapper}>
        <Animated.View
          style={{
            backgroundColor: colors.white,
            opacity: this.state.selectionAnimation,
            position: 'absolute' as 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0,
          }}
        />
        <TouchableOpacity
          style={style.button}
          onPress={() => this.props.onPress(
            this.props.data.node.image.uri,
            this.props.data.node.type,
          )}
          onLongPress={() => this.props.onPreview()}
          onPressOut={() => this.props.onPressOut()}
          delayLongPress={100}
          onPressIn={
            () => this.props.onPressIn(this.props.data.node.image.uri, this.props.data.node.type)
          }
        >
          <Animated.Image
            style={image}
            source={{ uri: this.props.data.node.image.uri }}
          />
          { this.props.data.node.type === 'ALAssetTypeVideo' ?
            <View style={style.videoIcon}>
              <Feather name={'play-circle'} size={48} color={'#FFFFFF'}/>
            </View>
            : null
          }
        </TouchableOpacity>
      </View>
    )
  }
}

const style = {
  videoIcon: {
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    width: '100%',
    height: '100%',
    position: 'absolute' as 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.24,
    shadowRadius: 3,
  },
  image: {
    width: third - 1,
    height: third - 1,
  },
  wrapper: {
    backgroundColor: 'rgba(0, 122, 255, 0.6)',
    width: third,
    height: third,
    flex: 0,
  },
  button: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0)',
  },
}
