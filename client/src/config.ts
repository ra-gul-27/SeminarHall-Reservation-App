import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'https://seminar-hall-reservation-app.vercel.app/api'
  },
  prod: {
    apiUrl: 'https://seminar-hall-reservation-app.vercel.app/api' 
  }
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  return ENV.prod;
};

export default getEnvVars();
