import Constants from 'expo-constants';

export default function getEnvironment() {
  let releaseChannel = Constants.manifest.releaseChannel;

  if (releaseChannel === undefined) {  // no releaseChannel (is undefined) in dev
    return {envName: "DEVELOPMENT", channelName: 'dev'};  // dev env settings
  }
  if (releaseChannel.indexOf('prod') !== -1) { // matches prod-v1, prod-v2, prod-v3
    return {envName: "PRODUCTION", channelName: releaseChannel };  // prod env settings
  }
  if (releaseChannel.indexOf('staging') !== -1) {  // matches staging-v1, staging-v2
    return {envName: "STAGING", channelName: 'stagging'}; // stage env settings
  }
}