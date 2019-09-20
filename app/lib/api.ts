import { ApiResponse, ApisauceConfig, create } from 'apisauce'
import { Platform } from 'react-native'
import config from '../../config'
import { IMediaReference } from '../types/photos'
import { retrieveToken, storeToken } from './asyncStorage'

import VersionNumber from 'react-native-version-number';

const {
  appVersion,
  buildVersion,
  bundleIdentifier,
} = VersionNumber

const headers = {
  appVersion,
  buildVersion,
  bundleIdentifier,
  os: Platform.OS,
  osVersion: Platform.Version,
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // tslint:disable-next-line: no-bitwise
    const r = Math.random() * 16 | 0
    // tslint:disable-next-line: no-bitwise
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function generateUUID() {
  const id = uuidv4()
  let didSave = false
  let attempts = 0
  while(!didSave || attempts < 3) {
    didSave = await storeToken('uuid', id)
    attempts++
  }
  return id || false
}
export async function collectUUID() {
  let uuid = await retrieveToken('uuid')
  if(!uuid) {
    uuid = await generateUUID() || ''
  }
  return uuid
}

const api = create({
  headers,
  baseURL: config.api,
} as ApisauceConfig)

api.addAsyncRequestTransform(request => async () => {
  // CookieManager.get(config.api).then((res: any) => {
  //   console.log(`CookieManager.get() => ${res}`)
  // })
  request.headers.uuid = await collectUUID()
  request.withCredentials = true
})

// api.addResponseTransform((res) => {
  // if(!res.headers) return
  // const cookies = (res as any).headers['set-cookie']
  // if(!cookies || !cookies.length) return
  // for(let i = cookies.length; i--;) {
  //   CookieManager.setFromResponse(
  //     config.api,
  //     cookies[i],
  //   ).then((didStoreCookie: boolean) => {
  //     console.log(`CookieManager.setFromResponse(${cookies[i]}) => ${res}`)
  //     CookieManager.get(config.api).then((res: any) => {
  //       console.log(`CookieManager.get() => ${res}`)
  //     })
  //   })
  // }
// })

const authedApi = create({
  headers,
  baseURL: config.api,
})

authedApi.addAsyncRequestTransform(request => async () => {
  // CookieManager.get(config.api).then((res: any) => {
  //   console.log(`CookieManager.get() => ${res}`)
  // })
  request.headers.uuid = await collectUUID()
  request.withCredentials = true
  request.headers.authToken = await retrieveToken('authToken')
})

const refreshApi = create({
  headers,
  baseURL: config.api,
})

refreshApi.addAsyncRequestTransform(request => async () => {
  request.headers.uuid = await collectUUID()
  request.withCredentials = true
  request.headers.authToken = await retrieveToken('authToken')
  request.headers.refreshToken = await retrieveToken('refreshToken')
})

export { api, authedApi, refreshApi }

// function saveCookies() {
// }

interface IMediaUploadReturn {
  err: boolean,
  errorMessage: string | undefined,
  urls: string | string[]
}

export const photoUpload = async (
  route: string,
  photos: IMediaReference[],
  authed: boolean = true,
  onProgress?: (progress: number, event: any) => any,
): Promise<IMediaUploadReturn> => {
  // return await retrieveToken('authentication').then(async (token) => {
    // Setup Formdata and append uris
  const data = new FormData();
  data.append('name', 'mediaUpload')
  for(let i = photos.length; i--;) {
    data.append('photos',  {
      uri: photos[i].uri,
      type: 'image/jpeg',
      name: `upload-${i}`,
    } as any)
  }
  const routeConfig = {
    onUploadProgress: (event: any) => {
      const progress = (event.loaded / event.total) * .95
      if(onProgress) {
        onProgress(progress, event)
      }
    },
  }
  // Request
  const response: ApiResponse<any> = authed ?
    await authedApi.post(route, data, routeConfig) :
    await api.post(route, data, routeConfig)
  if(response.ok && response.data && response.data.urls) {
    const mediaUpload = {
      err: false,
      errorMessage: '',
      urls: [],
    }
    if(response.data && response.data.urls) {
      mediaUpload.urls = response.data.urls
    }
    return mediaUpload
  }
  return {
    err: true,
    errorMessage: 'there was a problem uploading to the server',
    urls: [],
  }
  // })
}
