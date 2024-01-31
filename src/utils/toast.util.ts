import {ToastAndroid} from 'react-native';
import platformUtil from './platform.util';

export const LongToast = platformUtil.isAndroidPlatform()
  ? ToastAndroid.LONG
  : 0;
export const ShortToast = platformUtil.isAndroidPlatform()
  ? ToastAndroid.SHORT
  : 0;

const showToast: (message: string, duration?: number) => void = (
  message: string,
  duration: number = LongToast,
) => {
  if (message) {
    if (platformUtil.isAndroidPlatform()) {
      ToastAndroid.showWithGravity(message, duration, ToastAndroid.BOTTOM);
    }
  }
};

export default {showToast};
