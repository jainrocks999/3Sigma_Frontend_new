import React from 'react';
import { ActivityIndicator, NativeModules, Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
export enum MessageType {
  NONE = 'none',
  DEFAULT = 'default',
  INFO = 'info',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
}

const { StatusBarManager } = NativeModules;
const height = StatusBarManager.HEIGHT;

const GAlert = (
  message: string,
  type: MessageType = MessageType.DANGER,
  loading: boolean = false,
) =>
  showMessage({
    message: message,
    type: type,
    statusBarHeight: Platform.OS === 'ios' ? height : 0,
    icon: (props: any) =>
      loading && (
        <ActivityIndicator size={'large'} color={'white'} {...props} />
      ),
  });
export default GAlert;
