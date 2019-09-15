import React from 'react'
import {
  ScrollView,
  Text,
  View,
} from 'react-native'

import { colors, type } from '../../../../new_foundation'

import ActionButton from '../../../components/Buttons/ActionButton'
import FoodToggle from '../../../components/Buttons/FoodToggle'
import SetupWrapper from '../SetupWrapperComponent'

// tslint:disable-next-line: interface-over-type-literal
type ObjectOf<T> = {[key: string]: T}

enum Food {
  alcohol = 'alcohol',
  burger = 'burger',
  chinese = 'chinese',
  fusion = 'fusion',
  healthy = 'healthy',
  italian = 'italian',
  pizza = 'pizza',
  seafood = 'seafood',
  steakhouse = 'steakhouse',
  sushi = 'sushi',
  mexican = 'mexican',
  thai = 'thai',
}

const foodCategories = {
  [Food.alcohol]: false,
  [Food.burger]: false,
  [Food.chinese]: false,
  [Food.fusion]: false,
  [Food.healthy]: false,
  [Food.italian]: false,
  [Food.mexican]: false,
  [Food.pizza]: false,
  [Food.seafood]: false,
  [Food.steakhouse]: false,
  [Food.sushi]: false,
  [Food.thai]: false,
}

const foodNames: ObjectOf<string> = {
  [Food.alcohol]: 'Alcohol',
  [Food.burger]: 'Burgers',
  [Food.chinese]: 'Chinese',
  [Food.fusion]: 'Fusion',
  [Food.healthy]: 'Healthy',
  [Food.italian]: 'Italian',
  [Food.mexican]: 'Mexican',
  [Food.pizza]: 'Pizza',
  [Food.seafood]: 'Seafood',
  [Food.steakhouse]: 'Steakhouse',
  [Food.sushi]: 'Sushi',
  [Food.thai]: 'Thai',
}

interface IProps {
  path: string
  currentRoute: number
  routes: string[]
  errorMessage?: string
  food?: ObjectOf<boolean>
  incrementRoute: () => any
  change: (changes: any) => any
  push: (route: string) => any
  updateProfile: () => any
}
interface IState {
  food: ObjectOf<boolean>,
  disabled: boolean
}
export default class FoodComponent extends React.PureComponent<IProps, IState> {
  public state: IState = {
    food: this.props.food || foodCategories,
    disabled: // Disable Input if no food selected
      this.props.food &&
        Object.keys(this.props.food).filter(key => this.props.food![key]).length ?
        false : true,
  }
  public componentDidMount() {
    this.props.change({ food: undefined })
  }
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // Change in Props
      if (this.props.food && prevProps.food !== this.props.food) {
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
  private isFoodValid(food: ObjectOf<boolean>) {
    if(food && Object.keys(food).filter(key => food[key]).length) {
      return true
    }
    return false
  }
  private toggleFood(key: Food) {
    const food = { ...this.state.food }
    food[key] = !food[key]
    this.setState({
      food,
      disabled: !this.isFoodValid(food),
    })
  }
  public render() {
    return (
      <SetupWrapper>
        <Text style={style.title}>
          What are your favorite foods?
        </Text>
        <ScrollView
          // style={style.contentWrapper}
          contentContainerStyle={style.contentWrapper}
        >
          {Object.keys(this.state.food).map((key) => {
            console.log('URI: ', key, foodNames[key])
            console.log('is Active? ', this.state.food[key])
            return (
              <FoodToggle
                image={key as Food}
                key={key}
                label={foodNames[key]}
                active={this.state.food[key]}
                onPress={() => this.toggleFood(key as Food)}
              />
            )
          })}
        </ScrollView>
        <ActionButton
          onPress={() => this.props.change({ food: this.state.food })}
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
    ...type.title2,
    color: colors.white,
    marginTop: 40,
    marginBottom: 48,
  },
  contentWrapper: {
    flex: 1,
    width: 300,
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'space-between' as 'space-between',
  },
}
