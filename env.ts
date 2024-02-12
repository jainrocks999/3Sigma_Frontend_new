import {
  EnvironmentEnum,
  PaymentProviderEnum,
} from './src/models/consts/environment.enum';

export const ENVIRONMENT: EnvironmentEnum = EnvironmentEnum.PRODUCTION;
export const S3_URL = {
  [EnvironmentEnum.PRODUCTION]:
    'https://all-files-version-2.s3.ap-south-1.amazonaws.com/',
  [EnvironmentEnum.STAGING]:
    'https://all-files-version-2.s3.ap-south-1.amazonaws.com/',
  [EnvironmentEnum.DEVELOPMENT]:
    'https://all-files-version-2.s3.ap-south-1.amazonaws.com/',
};

export const SERVER_URL = {
  [EnvironmentEnum.PRODUCTION]: 'https://mapi2.3sigmacrm.com/api/v1/',
  [EnvironmentEnum.STAGING]: 'https://mapi2.3sigmacrm.com/api/v1/',
  [EnvironmentEnum.DEVELOPMENT]: 'https://mapi2.3sigmacrm.com/api/v1/',
};
export const DEV_ANDROID_OAUTH =
  '322938904388-mt8iupmrn5t5n6o4qcalb9v7eqchde74.apps.googleusercontent.com';
export const PROD_ANDROID_OAUTH =
  '322938904388-mt8iupmrn5t5n6o4qcalb9v7eqchde74.apps.googleusercontent.com';

export const DEV_IOS_OAUTH =
  '322938904388-v7gcvl3d46ilpu8ahic2hv6r8cilqeb2.apps.googleusercontent.com';
export const PROD_IOS_OAUTH =
  '322938904388-v7gcvl3d46ilpu8ahic2hv6r8cilqeb2.apps.googleusercontent.com';

// export const WEBPAGE_URL = 'http://integration.3sigmacrm.com/';
export const WEBPAGE_URL = {
  [EnvironmentEnum.PRODUCTION]: 'https://integration.3sigmacrm.com/',
  [EnvironmentEnum.STAGING]: 'https://integration.3sigmacrm.com/',
  [EnvironmentEnum.DEVELOPMENT]: 'http://192.168.0.102:3000/',
};

export const STRIPE_PUBLISHABLE_KEY =
  'pk_live_51NFW8lSGRFlxZecWKdNqQlMgUI6hwuKTnw2LTS0r3c43W2sFcRFTzGZ6xMg0KrrL0JfCtiRRtbNSnaAwA4KVRNKT00Go7QwTg3';

export const PAYMENT_PROVIDER = PaymentProviderEnum.STRIPE;
export const RAZORPAR_KEY = 'rzp_live_79BbGioQJ3aC3K';
export const APP_VERSION = '2.1.31';
export const APP_VERSION_DATE = '4th Aug 2023';
export const IAP_KEY = 'de7b8d0d9da6453d8b7d18403ed7ab1e';
