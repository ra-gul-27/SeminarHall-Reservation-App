import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: (() => {
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) {
        host = Constants.expoConfig.hostUri.split(':')[0];
      } else if (Constants.manifest?.debuggerHost) {
        host = Constants.manifest.debuggerHost.split(':')[0];
      }
      return `http://${host}:5000/api`;
    })()
  },
  prod: {
    // Replace this with your actual Render URL once deployed
    apiUrl: 'https://clgres-backend.onrender.com/api' 
  }
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  return ENV.prod;
};

export default getEnvVars();
