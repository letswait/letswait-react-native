const config: any = {}

config.api = 'https://lets-wait-staging.herokuapp.com'
config.socket = 'https://lets-wait-staging.herokuapp.com'
if(__DEV__) {
  config.api = 'https://letswait.ngrok.io'
  config.socket = 'https://letswait.ngrok.io'
}

export default config
