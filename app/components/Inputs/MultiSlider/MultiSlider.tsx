import React from 'react'
import {
  Dimensions,
  I18nManager,
  PanResponder,
  PanResponderGestureState,
  Platform,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native'

import { createArray, positionToValue, valueToPosition } from './converters';
import DefaultLabel from './DefaultLabel';
import DefaultMarker from './DefaultMarker';

interface IProps {
  values: number[],
  onValuesChangeStart: () => void,
  onValuesChange: (values: number[]) => void,
  onValuesChangeFinish: (values: number[]) => void,
  onMarkersPosition: (values: number[]) => void,
  step: number,
  min: number,
  max: number,
  touchDimensions: {
    height: number,
    width: number,
    borderRadius: number,
    slipDisplacement: number,
  },
  customMarker: any,
  customMarkerLeft: any,
  customMarkerRight: any,
  customLabel: any,
  markerOffsetX: number,
  markerOffsetY: number,
  sliderLength: number,
  onToggleOne?: () => void,
  onToggleTwo?: () => void,
  enabledOne: boolean,
  enabledTwo: boolean,
  allowOverlap: boolean,
  snapped: boolean,
  vertical: boolean,
  minMarkerOverlapDistance: number,
  optionsArray?: any[]
  selectedStyle?: any
  unselectedStyle?: any
  isMarkersSeparated?: boolean
  containerStyle?: any
  trackStyle?: any
  markerContainerStyle?: any
  markerStyle?: any
  pressedMarkerStyle?: any
  valuePrefix?: string
  valueSuffix?: string
}
interface IState {
  onePressed?: boolean,
  twoPressed?: boolean,
  pressedOne?: boolean,
  valueOne?: number,
  valueTwo?: number,
  pastOne?: number,
  pastTwo?: number,
  positionOne?: number,
  positionTwo?: number,
}
export default class MultiSlider extends React.Component<IProps,IState> {
  public static defaultProps = {
    values: [0],
    onValuesChangeStart: () => void 0,
    onValuesChange: () => void 0,
    onValuesChangeFinish: () => void 0,
    onMarkersPosition: () => void 0,
    step: 1,
    min: 0,
    max: 10,
    touchDimensions: {
      height: 50,
      width: 50,
      borderRadius: 15,
      slipDisplacement: 200,
    },
    customMarker: DefaultMarker,
    customMarkerLeft: DefaultMarker,
    customMarkerRight: DefaultMarker,
    customLabel: DefaultLabel,
    markerOffsetX: 0,
    markerOffsetY: 0,
    sliderLength: 280,
    enabledOne: true,
    enabledTwo: true,
    allowOverlap: false,
    snapped: false,
    vertical: false,
    minMarkerOverlapDistance: 0,
  };

  public state: IState
  public optionsArray?: any
  public stepLength: number
  private markerOne: any = null
  private panResponderOne: any = { panHandlers: null }
  private markerTwo: any = null
  private panResponderTwo: any = { panHandlers: null }
  constructor(props: IProps) {
    super(props);

    this.optionsArray = this.props.optionsArray || createArray(this.props.min, this.props.max, this.props.step);
    this.stepLength = this.props.sliderLength / this.optionsArray.length;

    const initialValues = this.props.values.map(value =>
      valueToPosition(value, this.optionsArray, this.props.sliderLength),
    );

    this.state = {
      pressedOne: true,
      valueOne: this.props.values[0],
      valueTwo: this.props.values[1],
      pastOne: initialValues[0],
      pastTwo: initialValues[1],
      positionOne: initialValues[0],
      positionTwo: initialValues[1],
      onePressed: false,
      twoPressed: false,
    };
  }

  public componentDidMount() {
    const customPanResponder = (start: Function, move: Function, end: Function) => {
      return PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: (evt, gestureState) => start(),
        onPanResponderMove: (evt, gestureState) => move(gestureState),
        onPanResponderTerminationRequest: (evt, gestureState) => false,
        onPanResponderRelease: (evt, gestureState) => end(gestureState),
        onPanResponderTerminate: (evt, gestureState) => end(gestureState),
        onShouldBlockNativeResponder: (evt, gestureState) => true,
      });
    };

    this.panResponderOne = customPanResponder(
      this.startOne,
      this.moveOne,
      this.endOne,
    )
    this.panResponderTwo = customPanResponder(
      this.startTwo,
      this.moveTwo,
      this.endTwo,
    );
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.state.onePressed || this.state.twoPressed) {
      return;
    }

    const nextState: any = { ...prevState }
    if (
      prevProps.min !== this.props.min ||
      prevProps.max !== this.props.max ||
      prevProps.step !== this.props.step ||
      prevProps.values[0] !== this.state.valueOne ||
      prevProps.sliderLength !== this.props.sliderLength ||
      prevProps.values[1] !== this.state.valueTwo ||
      (prevProps.sliderLength !== this.props.sliderLength &&
        prevProps.values[1])
    ) {
      this.optionsArray =
        this.props.optionsArray ||
        createArray(prevProps.min, prevProps.max, prevProps.step);

      this.stepLength = this.props.sliderLength / this.optionsArray.length;

      const positionOne = valueToPosition(
        prevProps.values[0],
        this.optionsArray,
        prevProps.sliderLength,
      );
      nextState.valueOne = prevProps.values[0];
      nextState.pastOne = positionOne;
      nextState.positionOne = positionOne;

      const positionTwo = valueToPosition(
        prevProps.values[1],
        this.optionsArray,
        prevProps.sliderLength,
      );
      nextState.valueTwo = prevProps.values[1];
      nextState.pastTwo = positionTwo;
      nextState.positionTwo = positionTwo;
    }

    // tslint:disable-next-line: triple-equals
    if (nextState !== {} && nextState == prevState) {
      this.setState(nextState);

      if (typeof nextState.positionOne !== 'undefined' && typeof nextState.positionTwo !== 'undefined') {
        this.props.onMarkersPosition([nextState.positionOne, nextState.positionTwo]);
      }
    }
  }

  public startOne = () => {
    if (this.props.enabledOne) {
      this.props.onValuesChangeStart();
      this.setState({
        onePressed: !this.state.onePressed,
      });
    }
  };

  public startTwo = () => {
    if (this.props.enabledTwo) {
      this.props.onValuesChangeStart();
      this.setState({
        twoPressed: !this.state.twoPressed,
      });
    }
  };

  public moveOne = (gestureState: PanResponderGestureState) => {
    if (!this.props.enabledOne) {
      return;
    }

    const accumDistance = this.props.vertical
      ? -gestureState.dy
      : gestureState.dx;
    const accumDistanceDisplacement = this.props.vertical
      ? gestureState.dx
      : gestureState.dy;

    const unconfined = I18nManager.isRTL && this.state.pastOne
      ? this.state.pastOne - accumDistance
      : accumDistance + (this.state.pastOne || 0);
    const bottom = 0;
    const trueTop =
        this.state.positionTwo &&
        this.state.positionTwo - (this.props.allowOverlap ? 0 : this.props.minMarkerOverlapDistance > 0
            ? this.props.minMarkerOverlapDistance
            : this.stepLength);
    const top = trueTop === 0 ? 0 : trueTop || this.props.sliderLength;
    const confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    const slipDisplacement = this.props.touchDimensions.slipDisplacement;

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      const value = positionToValue(
        confined,
        this.optionsArray,
        this.props.sliderLength,
      );
      const snapped = valueToPosition(
        value!,
        this.optionsArray,
        this.props.sliderLength,
      );
      this.setState({
        positionOne: this.props.snapped ? snapped : confined,
      });

      if (value !== this.state.valueOne) {
        this.setState(
          {
            valueOne: value!,
          },
          () => {
            const change = [this.state.valueOne];
            if (this.state.valueTwo) {
              change.push(this.state.valueTwo);
            }
            this.props.onValuesChange(change as number[]);

            this.props.onMarkersPosition([this.state.positionOne!, this.state.positionTwo!]);
          },
        );
      }
    }
  };

  public moveTwo = (gestureState: PanResponderGestureState) => {
    if (!this.props.enabledTwo) {
      return;
    }

    const accumDistance = this.props.vertical
      ? -gestureState.dy
      : gestureState.dx;
    const accumDistanceDisplacement = this.props.vertical
      ? gestureState.dx
      : gestureState.dy;

    const unconfined = I18nManager.isRTL && this.state.pastTwo
      ? this.state.pastTwo - accumDistance
      : accumDistance + (this.state.pastTwo || 0);
    const bottom =
      this.state.positionOne && this.state.positionOne + (this.props.allowOverlap ? 0
          : this.props.minMarkerOverlapDistance > 0
              ? this.props.minMarkerOverlapDistance
              : this.stepLength);
    const top = this.props.sliderLength;
    const confined =
      bottom && unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    const slipDisplacement = this.props.touchDimensions.slipDisplacement;

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      const value = positionToValue(
        confined,
        this.optionsArray,
        this.props.sliderLength,
      );
      const snapped = valueToPosition(
        value!,
        this.optionsArray,
        this.props.sliderLength,
      );

      this.setState({
        positionTwo: this.props.snapped ? snapped : confined,
      });

      if (value !== this.state.valueTwo) {
        this.setState(
          {
            valueTwo: value!,
          },
          () => {
            this.props.onValuesChange([this.state.valueOne!, this.state.valueTwo!]);

            this.props.onMarkersPosition([this.state.positionOne!, this.state.positionTwo!]);
          },
        );
      }
    }
  };

  public endOne = (gestureState: PanResponderGestureState) => {
    if (gestureState.moveX === 0 && this.props.onToggleOne) {
      this.props.onToggleOne();
      return;
    }

    this.setState(
      {
        pastOne: this.state.positionOne,
        onePressed: !this.state.onePressed,
      },
      () => {
        const change = [this.state.valueOne];
        if (this.state.valueTwo) {
          change.push(this.state.valueTwo);
        }
        this.props.onValuesChangeFinish(change as number[]);
      },
    );
  };

  public endTwo = (gestureState: PanResponderGestureState) => {
    if (gestureState.moveX === 0 && this.props.onToggleTwo) {
      this.props.onToggleTwo();
      return;
    }

    this.setState(
      {
        twoPressed: !this.state.twoPressed,
        pastTwo: this.state.positionTwo,
      },
      () => {
        this.props.onValuesChangeFinish([
          this.state.valueOne!,
          this.state.valueTwo!,
        ]);
      },
    );
  };

  public render() {
    const { positionOne, positionTwo } = this.state;
    const {
      selectedStyle,
      unselectedStyle,
      sliderLength,
      markerOffsetX,
      markerOffsetY,
    } = this.props;

    // when allowOverlap, positionTwo could be 0, identified as string '0'
    // and throwing 'RawText 0 needs to be wrapped in <Text>' error
    const twoMarkers = this.props.values.length === 2

    const trackOneLength: number = positionOne || 0;
    const trackOneStyle = twoMarkers
      ? unselectedStyle
      : selectedStyle || styles.selectedTrack;
    const trackThreeLength: number = twoMarkers && positionTwo ? sliderLength - positionTwo : 0;
    const trackThreeStyle = unselectedStyle;
    const trackTwoLength: number = sliderLength - (trackOneLength || 0) - trackThreeLength;
    const trackTwoStyle = twoMarkers
      ? selectedStyle || styles.selectedTrack
      : unselectedStyle;
    const Marker = this.props.customMarker;

    const MarkerLeft = this.props.customMarkerLeft;
    const MarkerRight = this.props.customMarkerRight;
    const isMarkersSeparated = this.props.isMarkersSeparated! || false;

    // const Label = this.props.customLabel;

    const {
      slipDisplacement,
      height,
      width,
      borderRadius,
    } = this.props.touchDimensions;
    const touchStyle = {
      borderRadius: borderRadius || 0,
    };

    const markerContainerOne = {
      top: markerOffsetY - 24,
      left: trackOneLength + markerOffsetX - 24,
    };

    const markerContainerTwo = {
      top: markerOffsetY - 24,
      right: trackThreeLength - markerOffsetX - 24,
    };

    const containerStyle = [styles.container, this.props.containerStyle];

    if (this.props.vertical) {
      containerStyle.push({
        transform: [{ rotate: '-90deg' }],
      });
    }

    const leftDiff = (Dimensions.get('window').width - sliderLength) / 2;

    return (
      <View>
        {/* <Label
          leftDiff={leftDiff}
          oneMarkerValue={this.state.valueOne}
          twoMarkerValue={this.state.valueTwo}
          oneMarkerLeftPosition={positionOne}
          twoMarkerLeftPosition={positionTwo}
        /> */}

        <View style={containerStyle}>
          <View style={[styles.fullTrack, { width: sliderLength }]}>
            <View
              style={[
                styles.track,
                this.props.trackStyle,
                trackOneStyle,
                { width: trackOneLength },
              ]}
            />
            <View
              style={[
                styles.track,
                this.props.trackStyle,
                trackTwoStyle,
                { width: trackTwoLength },
              ]}
            />
            {twoMarkers && (
              <View
                style={[
                  styles.track,
                  this.props.trackStyle,
                  trackThreeStyle,
                  { width: trackThreeLength },
                ]}
              />
            )}
            <View
              style={[
                styles.markerContainer,
                markerContainerOne,
                this.props.markerContainerStyle,
                positionOne && positionOne > sliderLength / 2 && styles.topMarkerContainer,
              ]}
            >
              <View
                style={[styles.touch, touchStyle]}
                ref={component => (this.markerOne = component)}
                {...this.panResponderOne.panHandlers}
              >
                {isMarkersSeparated === false ? (
                  <Marker
                    enabled={this.props.enabledOne}
                    pressed={this.state.onePressed}
                    markerStyle={[styles.marker, this.props.markerStyle]}
                    pressedMarkerStyle={this.props.pressedMarkerStyle}
                    currentValue={this.state.valueOne}
                    valuePrefix={this.props.valuePrefix}
                    valueSuffix={this.props.valueSuffix}
                  />
                ) : (
                  <MarkerLeft
                    enabled={this.props.enabledOne}
                    pressed={this.state.onePressed}
                    markerStyle={[styles.marker, this.props.markerStyle]}
                    pressedMarkerStyle={this.props.pressedMarkerStyle}
                    currentValue={this.state.valueOne}
                    valuePrefix={this.props.valuePrefix}
                    valueSuffix={this.props.valueSuffix}
                  />
                )}
              </View>
            </View>
            {twoMarkers &&
              positionOne !== this.props.sliderLength && (
                <View
                  style={[
                    styles.markerContainer,
                    markerContainerTwo,
                    this.props.markerContainerStyle,
                  ]}
                >
                  <View
                    style={[styles.touch, touchStyle]}
                    ref={component => (this.markerTwo = component)}
                    {...this.panResponderTwo.panHandlers}
                  >
                    {isMarkersSeparated === false ? (
                      <Marker
                        pressed={this.state.twoPressed}
                        markerStyle={this.props.markerStyle}
                        pressedMarkerStyle={this.props.pressedMarkerStyle}
                        currentValue={this.state.valueTwo}
                        enabled={this.props.enabledTwo}
                        valuePrefix={this.props.valuePrefix}
                        valueSuffix={this.props.valueSuffix}
                      />
                    ) : (
                      <MarkerRight
                        pressed={this.state.twoPressed}
                        markerStyle={this.props.markerStyle}
                        pressedMarkerStyle={this.props.pressedMarkerStyle}
                        currentValue={this.state.valueTwo}
                        enabled={this.props.enabledTwo}
                        valuePrefix={this.props.valuePrefix}
                        valueSuffix={this.props.valueSuffix}
                      />
                    )}
                  </View>
                </View>
              )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 50,
    justifyContent: 'center',
  },
  fullTrack: {
    flexDirection: 'row',
  },
  track: {
    ...Platform.select({
      ios: {
        height: 2,
        borderRadius: 2,
        backgroundColor: '#A7A7A7',
      },
      android: {
        height: 2,
        backgroundColor: '#CECECE',
      },
    }),
  },
  selectedTrack: {
    ...Platform.select({
      ios: {
        backgroundColor: '#095FFF',
      },
      android: {
        backgroundColor: '#0D8675',
      },
    }),
  },
  markerContainer: {
    position: 'absolute',
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMarkerContainer: {
    zIndex: 1,
  },
  touch: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  marker: {

  },
});
