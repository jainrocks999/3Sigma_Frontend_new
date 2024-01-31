import {Rationale} from 'react-native';
import {
  check,
  Permission,
  PERMISSIONS,
  request,
} from 'react-native-permissions';
import i18n from '../i18n/i18n';
import platformUtil from './platform.util';

export type PermissionResult =
  | 'unavailable'
  | 'blocked'
  | 'denied'
  | 'granted'
  | 'limited';

const requestAndroidPermission = (
  permission: Permission,
  callback: (result: PermissionResult) => void,
  rationale?: Rationale,
) => {
  request(permission, rationale)
    .then(result => {
      callback(result);
    })
    .catch(error => {
      console.error(
        `Error caught on requesting ${permission} permission`,
        error,
      );
    });
};

const checkAndroidPermission = (
  permission: Permission,
  callback: (result: PermissionResult) => void,
) => {
  check(permission)
    .then(result => {
      callback(result);
    })
    .catch(error => {
      console.error(`Error caught on checking ${permission} permission`, error);
    });
};

const cameraRationale: Rationale = {
  title: i18n.t('permission.read.camera.heading'),
  buttonPositive: i18n.t('common.allow').toUpperCase(),
  message: i18n.t('permission.read.camera.message'),
  buttonNegative: i18n.t('common.deny').toUpperCase(),
};

const writeStorageRationale: Rationale = {
  title: i18n.t('permission.write.storage.heading'),
  message: i18n.t('permission.write.storage.message'),
  buttonNeutral: i18n.t('common.later'),
  buttonNegative: i18n.t('common.cancel'),
  buttonPositive: i18n.t('common.allow'),
};

const readStorageRationale: Rationale = {
  title: i18n.t('permission.read.storage.heading'),
  message: i18n.t('permission.read.storage.message'),
  buttonNeutral: i18n.t('common.later'),
  buttonNegative: i18n.t('common.cancel'),
  buttonPositive: i18n.t('common.allow'),
};

const readContactRationale: Rationale = {
  title: i18n.t('permission.read.contact.heading'),
  buttonPositive: i18n.t('common.allow').toUpperCase(),
  message: i18n.t('permission.read.contact.message'),
  buttonNegative: i18n.t('common.deny').toUpperCase(),
};

const readSMSRationale: Rationale = {
  title: i18n.t('permission.read.sms.heading'),
  buttonPositive: i18n.t('common.allow').toUpperCase(),
  message: i18n.t('permission.read.sms.message'),
  buttonNegative: i18n.t('common.deny').toUpperCase(),
};

// TODO: Class or factory?
// TODO: Implement permission for IOS later...maybe move to other utils file
const permissionUtil: any = {
  checkContactPermission: (callback: (result: PermissionResult) => void) => {
    if (platformUtil.isAndroidPlatform()) {
      checkAndroidPermission(PERMISSIONS.ANDROID.READ_CONTACTS, callback);
    }
  },

  requestReadSMS: (callback: (result: PermissionResult) => void) => {
    if (platformUtil.isAndroidPlatform()) {
      requestAndroidPermission(
        PERMISSIONS.ANDROID.READ_SMS,
        callback,
        readSMSRationale,
      );
    }
  },

  requestReadContact: (callback: (result: PermissionResult) => void) => {
    if (platformUtil.isAndroidPlatform()) {
      requestAndroidPermission(
        PERMISSIONS.ANDROID.READ_CONTACTS,
        callback,
        readContactRationale,
      );
    }
  },

  requestCameraAccess: (callback: (result: PermissionResult) => void) => {
    if (platformUtil.isAndroidPlatform()) {
      requestAndroidPermission(
        PERMISSIONS.ANDROID.CAMERA,
        callback,
        cameraRationale,
      );
    }
  },

  requestWriteToStorage: (callback: (result: PermissionResult) => void) => {
    if (platformUtil.isAndroidPlatform()) {
      requestAndroidPermission(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        callback,
        writeStorageRationale,
      );
    }
  },

  requestReadToStorage: (callback: (result: PermissionResult) => void) => {
    if (platformUtil.isAndroidPlatform()) {
      requestAndroidPermission(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        callback,
        readStorageRationale,
      );
    }
  },

  // TODO: MANAGE_EXTERNAL_STORAGE needed for accessing non-media file from external location is
  // not supported by current react native version
};

export default permissionUtil;
