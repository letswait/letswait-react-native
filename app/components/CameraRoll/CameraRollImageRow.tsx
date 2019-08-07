import React from 'react'
import {
  CameraRollEdgeInfo,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native'
import { CameraRollRow } from 'storybook/types/photos';
import CameraRollImage from './CameraRollImage'

const { height, width } = Dimensions.get('window')

interface IProps {
  onPress: (imageURI: string, type: string) => any;
  onPressIn: (imageURI: string, type: string) => any;
  onPressOut: () => any;
  onPreview: () => any;
  data: CameraRollRow;
  row?: any;
  isSelected: boolean[]
}
export default class CameraRollImageRow extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public render() {
    const photos = this.props.data.map((item, index) => {
      if(item === null) {
        return null
      }
      return (
        <CameraRollImage
          key={this.props.data[index].node.image.uri}
          data={this.props.data[index]}
          col={index}
          row={this.props.row}
          onPress={(imageURI, type) => this.props.onPress(imageURI, type)}
          onPressIn={(imageURI: string, type: string) => this.props.onPressIn(imageURI, type)}
          onPressOut={() => this.props.onPressOut()}
          onPreview={() => this.props.onPreview()}
          active={this.props.isSelected[index]}
        />
      )
    })
    return (
      <View style={style.imageRow}>
        {photos}
      </View>
    )
  }
}

const style = StyleSheet.create({
  imageRow: {
    width,
    height: width/3,
    flexDirection: 'row',
    display: 'flex',
  },
})
