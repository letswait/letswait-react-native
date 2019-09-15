import { ObjectOf } from "./helpers";

declare namespace ReduxStore {
  export type User = {
    _id: any
    age: number
    birth: Date
    name: string
    tokens: number
    profile: IUserProfile
    searchSettings: IUserSearchSettings
    hideProfile: boolean,
    canSummonControlPanel?: boolean
    significantOther?: string
    sms?: string
  }

  export type Point = {
    coordinates: [number, number],
    type: 'Point'
  }

  export interface IUserProfile {
    gender: string
    images: [string, string?, string?, string?, string?, string?]
    food: string[]
    goal: 'exclusive' | 'unsure' | 'casual' | 'serious'
    work: {
      position: string
      employer: string
    }
    aboutMe: string
    school: {
      name: string,
      graduationYear?: number
    }
    questions: ObjectOf<string>
    height?: number // Height in Centimeters
  }

  export interface IUserSearchSettings {
    sexualPreference: 'male' | 'female' | 'everyone'
    // Radius in Miles
    radius: number
    ageRange: [number, number]
  }

  export type Match = {
    _id: ObjectId,
    timestamp: Date,
    userProfiles: IMatchUser[]
    state: MatchState
    users: ObjectOf<UserMatched>
    chat: IChat[]
    dates: IDate[]
  }

  export interface IChat {
    _id: ObjectId,
    sentTimestamp: Date
    readTimestamp?: Date
    user: string
    message: IMessage
    reactions: Map<string, Reaction> // key/value pair with user _id and reaction
  }

  export interface IMessage {
    text: string
    image?: string
    cloudfront?: string
    location?: Point
    campaignId?: string
  }

  export enum Reaction {
    weird = 'weird',
    love = 'love',
    excited = 'excited',
    like = 'like',
  }

  export type MatchState =
    'queued'
    | 'timeout'
    | 'matched'
    | 'unmatched'
    | 'blocked'
    | 'suspend'
    | 'suspended'

  export type UserMatched =
    'queued'
    | 'accepted'
    | 'rejected'

  export interface IDate {
    _id: ObjectId,
    venue: ObjectId,
    logo: string,
    name: string,
    location: Point,
    campaignId: string,
    expiresOn: Date,
    code: string,
    consumed: boolean,
  }

  export interface IMatchUser {
    _id: ObjectId,
    profile: IUserProfile
    age: number,
    name: string,
    isBot?: boolean
    botBehavior?: {
      swipesRight: boolean, // Matches with users
      plansAhead: boolean, // Self-sets a date
      enthusiastic: boolean,
      punctual: boolean, // Moves location to Venue Coordinates
    }
  }

  export type ObjectId = any
}