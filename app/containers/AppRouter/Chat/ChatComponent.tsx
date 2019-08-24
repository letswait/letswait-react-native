import React from 'react'
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  PushNotificationIOS,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

import { colors, spacing, type } from '../../../../foundation'
import FeatherButton from '../../../components/Camera/CameraButton'

import MatchRow from '../../../components/Matches/Match'
import MatchQueue from '../../../components/Matches/QueueMatch'

import { ApiResponse } from 'apisauce';
import { authedApi } from '../../../lib/api'

import ChatInput from '../../../components/Chat/ChatInput'
import CandidateMessage from '../../../components/Chat/RecievedMessage'
import UserMessage from '../../../components/Chat/SentMessage'

const { width, height } = Dimensions.get('window')

interface IProps {
  user: any,
  shouldUpdate: boolean,
  match: any,
}

export default class MatchesComponent extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }
  public shouldComponentUpdate() {
    return this.props.shouldUpdate
  }
  public scrollView: any = null
  public render() {
    return (
      <KeyboardAvoidingView style={style.matchWrapper} behavior="padding">
        <View style={{ flex: 1 }}/>
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical
          style={style.matchScroll}
          ref={c => this.scrollView = c}
          onContentSizeChange={() => {
            if(this.scrollView) {
              this.scrollView.scrollToEnd()
            }
          }}
          contentContainerStyle={{ paddingBottom: 16, paddingTop: 80 }}
        >
          {this.props.match && this.props.match.chat.map((msg: any, i: number, arr: any[]) => {
            return msg.user === this.props.user._id ?
              <CandidateMessage {...msg} key={i} /> :
              <UserMessage {...msg} key={i} />
          })}
        </ScrollView>
        <ChatInput
          // onSend={(message: string) => Alert.alert('sent text message', message)}
          onSend={(message: string) => console.log(message)}
          // onSendImage={image => Alert.alert('sent image', image.uri)}
          onSendImage={image => console.log(image)}
        />
      </KeyboardAvoidingView>
    )
  }
}

const style = {
  matchWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.transparent,
    flexDirection: 'column' as 'column',
    display: 'flex' as 'flex',
  },
  matchScroll: {
    width,
    flexGrow: 0,
    flex: 0,
    backgroundColor: colors.transparent,
  },
}
