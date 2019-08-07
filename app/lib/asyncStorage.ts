import AsyncStorage from '@react-native-community/async-storage'

/**
 * Store Token - Asyncronous Wrapper for simple, effective AsyncStorage
 * @async
 * @function
 * @todo Remove manual type-checking after typescript implementation
 */
export const storeToken = async (key: string, value: string = '') => {
  try {
    await AsyncStorage.setItem(key, value)
    return true
  } catch(e) {
    return false
  }
}

/**
 * Get Token - Asyncronous Wrapper for simple, effective AsyncStorage
 * @async
 * @function
 * @todo Remove manual type-checking after typescript is implementation
 * @todo Return empty string on errors or null values after typescript implementation
 */
export const retrieveToken = async (key: string): Promise<string | undefined> => {
  try {
    return await AsyncStorage.getItem(key) || undefined
  } catch(e) {
    return undefined
  }
}
