import crashlytics from '@react-native-firebase/crashlytics';
const logger = {
  log: (m: string) => crashlytics().log(m),
  error: (error: any) => crashlytics().recordError(error),
};
export default logger;
