import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Alert,
} from 'react-native';

interface IProps {
  leftDiff: number
  labelStyle?: any
  labelTextStyle?: any
  oneMarkerValue: string | number
  twoMarkerValue: string | number
  oneMarkerLeftPosition: number
  twoMarkerLeftPosition: number
}
export default class DefaultLabel extends React.PureComponent<IProps> {
  public static defaultProps = {
    leftDiff: 0,
    labelStyle: {},
    labelTextStyle: {},
  };
  public render() {
    const {
      leftDiff,
      labelStyle,
      labelTextStyle,
      oneMarkerValue,
      twoMarkerValue,
      oneMarkerLeftPosition,
      twoMarkerLeftPosition,
    } = this.props;

    return (
      <View style={{ position: 'relative' }}>
        {oneMarkerValue && oneMarkerLeftPosition !== undefined &&
          <View style={[styles.sliderLabel, { left: (oneMarkerLeftPosition - leftDiff) }, labelStyle]}>
            <Text style={[styles.sliderLabelText, labelTextStyle]}>{oneMarkerValue}</Text>
          </View>
        }
        {twoMarkerValue && twoMarkerLeftPosition !== undefined &&
          <View style={[styles.sliderLabel, { left: (twoMarkerLeftPosition - leftDiff) }, labelStyle]}>
            <Text style={[styles.sliderLabelText, labelTextStyle]}>{twoMarkerValue}</Text>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sliderLabel: {
    position: 'absolute',
    top: -24,
    minWidth: 51,
    padding: 8,
    backgroundColor: '#fff',
  },
  sliderLabelText: {
    alignItems: 'center',
    textAlign: 'center',
    fontStyle: 'normal',
    fontSize: 11,
  },
})
