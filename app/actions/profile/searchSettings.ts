

import {
  CHANGE_SEARCH_SETTINGS,
} from './index'

export const changeSearchSettings = (changes: {
  radius?: number,
  ageRange?: [number, number],
  sexualPreference?: 'male' | 'female' | 'eveyone',
}) => {
  const { radius, ageRange, sexualPreference } = changes
  return {
    type: CHANGE_SEARCH_SETTINGS,
    payload: {
      ...(radius ? { radius } : null),
      ...(ageRange ? { ageRange } : null),
      ...(sexualPreference ? { sexualPreference } : null),
    }
  }
}
