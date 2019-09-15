import React from 'react'
import {
  TextInput,
  View,
} from 'react-native'

import _ from 'lodash'

import { colors, type } from '../../../new_foundation'

interface IProps {
  onComplete: (code: string) => any
  onClear: () => any
}
interface IState {
  code: string[],
  currentIndex: number,
}
export default class CodeInput extends React.Component<IProps, IState> {
  private inputRefs: any[]
  constructor(props: IProps) {
    super(props)
    this.state = {
      code:['', '', '', ''],
      currentIndex: 0,
    }
    this.inputRefs = []
  }
  public clear() {
    this.setState({
      code: ['', '', '', ''],
      currentIndex: 0,
    })
    this.setFocus(0)
  }
  private setFocus(index: number) {
    // const i = Math.min(index, 3)
    this.inputRefs[index].focus()
  }

  public blur() {
    this.inputRefs[this.state.currentIndex].blur()
  }

  private onFocus = (index: number) => () => {
    const codeArr = this.state.code
    const currentEmptyIndex = _.findIndex(codeArr, c => !c)
    if(currentEmptyIndex !== -1 && currentEmptyIndex < index) {
      return this.setFocus(currentEmptyIndex)
    }
    if(currentEmptyIndex !== index) {
      const newCodeArr = codeArr.map((v, i) => (i < index ? v : ''))
      this.setState({
        code: newCodeArr,
        currentIndex: index,
      })
    }
  }
  private _onKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Backspace') {
      const { currentIndex } = this.state
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0
      this.setFocus(nextIndex)
      this.props.onClear()
    }
  }
  private _onInputCode = (index: number) => (number: string) => {
    if(number.length > 1) {
      if(index === 1 && number.length === 4) {
        this.props.onComplete(number)
        this.setState({ code: number.split(''), currentIndex: 3 })
      }
    } else {
      const newCodeArr = _.clone(this.state.code)
      newCodeArr[index] = number
      if(index === 3) {
        const code = newCodeArr.join('')
        this.props.onComplete(code)
      } else {
        this.setFocus(this.state.currentIndex + 1)
      }
      this.setState((prevState: IState): IState => {
        const newIndex = Math.min(prevState.currentIndex + 1, 3)
        return {
          code: newCodeArr,
          currentIndex: newIndex,
        }
      })
    }
  }

  public render() {
    const digits =  _.range(4).map((id: number) => {
      return (
      <View style={{}} key={id}>
        <TextInput
          style={style.input}
          ref={ref => this.inputRefs[id] = ref}
          returnKeyType={'done'}
          autoFocus={id === 0}
          onFocus={this.onFocus(id)}
          value={this.state.code[id] ? this.state.code[id].toString() : ''}
          onChangeText={this._onInputCode(id)}
          onKeyPress={this._onKeyPress}
          maxLength={1}
          keyboardType="numeric"
        />
        <View style={style.digitUnderline}/>
      </View>
      )
    })
    return (
      <View style={style.wrapper}>
        {digits}
      </View>
    )
  }
}

const style = {
  wrapper: {
    flexDirection: 'row' as 'row',
  },
  digitWrapper: {
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    flex: 1,
  },
  input: {
    ...type.title1,
    width: '80%',
    maxWidth: 60,
    maxHeight: 75,
    textAlign: 'center' as 'center',
    color: colors.white,
    aspectRatio: 0.75,
  },
  digitUnderline: {
    width: 48,
    height: 2,
    backgroundColor: colors.white,
    borderRadius: 1,
  },
}
