import {Platform} from 'react-native';

const platformUtil = {
  isAndroidPlatform: (): boolean => Platform.OS === 'android',
  isIOSPlatform: (): boolean => Platform.OS === 'ios',
};

export default platformUtil;
