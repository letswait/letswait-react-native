import React from 'react'
import {
  Text,
  View,
} from 'react-native'

import moment, { Moment } from 'moment'
import DatePicker from 'react-native-datepicker'

import ActionButton from '../../../components/Buttons/ActionButton'

import Feather from 'react-native-vector-icons/Feather'
import { colors, type } from '../../../../new_foundation'

import SetupWrapper from '../SetupWrapperComponent';

interface IProps {
  path: string
  currentRoute: number
  routes: string[]
  errorMessage?: string
  birth?: string
  incrementRoute: () => any
  change: (changes: any) => any
  push: (route: string) => any
  updateProfile: () => any
  postingProfile: boolean
}
interface IState {
  date: Moment,
  disabled: boolean
}
export default class BirthdayComponent extends React.Component<IProps, IState> {
  public state: IState
  constructor(props: IProps) {
    super(props)
    const date = this.props.birth ? moment(this.props.birth, 'L') : moment()
    this.state = {
      date,
      disabled: date.diff(moment(), 'years') <= -18 ? false : true,
    }
  }
  public componentDidMount() {
    this.props.change({ birth: undefined })
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // Change in Props
      if(this.props.birth && prevProps.birth !== this.props.birth) {
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
  private setDate(date: Moment) {
    let disabled = true
    if(date.diff(moment(), 'years') <= -18) disabled = false
    console.log(date.diff(moment(), 'years'), date, disabled)
    this.setState({ date, disabled })
  }
  public render() {
    const Icon = (
      <Feather
        color={colors.white}
        name="calendar"
        size={24}
        style={style.featherIcon}
      />
    )
    return (
      <SetupWrapper>
        <Text style={style.title}>
          When were you born?
        </Text>
        <View style={style.contentWrapper}>
          <DatePicker
            date={this.state.date}
            mode="date"
            placeholder="Select your birthdate"
            format="LL"
            maxDate={new Date()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={date => this.setDate(moment(date))}
            style={style.dateButtonWrapper}
            customStyles={style.dateButtonStyles}
            iconComponent={Icon}
          />
        </View>
        <ActionButton
          onPress={() => this.props.change({ birth: this.state.date.format('L') })}
          disabled={this.state.disabled}
          loading={this.props.postingProfile}
        >
          Next
        </ActionButton>
      </SetupWrapper>
    )
  }
}

const style = {
  title: {
    ...type.title2,
    color: colors.white,
    marginTop: 40,
    marginBottom: 48,
  },
  contentWrapper: {
    flex: 1,
  },
  dateButtonWrapper: {
    width: 275,
  },
  featherIcon: {
    lineHeight: 40,
    height: 40,
    marginRight: 16,
  },
  dateButtonStyles: {
    dateInput: { // Date Container
      borderWidth: 0,
      borderColor: colors.white,
      borderBottomWidth: 1,
      flex: 1,
      flexDirection: 'row' as 'row',
      marginRight: 24,
    },
    disabled: {

    },
    dateTouchBody:{ // Component Container
      flex: 1,
      flexDirection: 'row-reverse' as 'row-reverse',
      position: 'relative' as 'relative',
    },
    dateIcon:{
      flex: 0,
      height: 40,
    },
    placeholderText: {

    },
    dateText: {
      flex: 1,
      ...type.large,
      color: colors.white,
      textAlign: 'left' as 'left',
    },
  },
}
