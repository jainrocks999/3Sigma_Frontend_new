/* eslint-disable no-param-reassign */
import axios, {AxiosResponse} from 'axios';
import SInfoTypeEnum from '../models/common/sInfoType.enum';
import sInfoUtil from '../utils/sInfo.util';
import ApiErrorEnum from './apiError.enum';
import {DevSettings} from 'react-native';

import {SERVER_URL, ENVIRONMENT} from '../../env';
import {navigationRef} from '../navigators/NavigationService';
import ScreenNameEnum from '../models/routes/screenName.enum';
import GAlert from 'library/common/GAlert';
import logger from 'library/hooks/logger';

const securedApi = axios.create({
  baseURL: SERVER_URL[ENVIRONMENT],
});

const setJwt = async (config: any) => {
  // console.log('URL', config.method, config.url);
  logger.log(config.url);
  config.metadata = {startTime: new Date(), url: config.url};
  const jwt = await sInfoUtil.fetch(SInfoTypeEnum.JWT);
  if (jwt) {
    // eslint-disable-next-line dot-notation
    config.headers['Authorization'] = `Bearer ${jwt}`;
    config.timeout = 1000 * 5;
    return Promise.resolve(config);
  }
  return Promise.reject();
};

securedApi.interceptors.request.use(
  (config: any) => setJwt(config),
  (error: any) => {
    Promise.reject(error);
  },
);

securedApi.interceptors.response.use(
  (response: AxiosResponse) => {
    const duration = new Date() - response.config.metadata.startTime;
    console.log(response.config.metadata.url, `${duration}ms`);
    return response.data;
  },
  async (error: any) => {
    console.log('Error message 1 - ', error.response.data?.message, error);
    logger.error(error);
    const duration = new Date() - error.config.metadata.startTime;
    console.log(error.config.metadata.url, `${duration}ms`);
    if (error.code === ApiErrorEnum.CONN_ABORTED) {
      GAlert('Request timed out, request aborted please try again');
    }
    if (
      error.response.data &&
      error.response.data?.message === 'Unauthorized access'
    ) {
      await sInfoUtil.remove(SInfoTypeEnum.JWT);
      await sInfoUtil.remove(SInfoTypeEnum.USER_CONTEXT);
      GAlert('Token expired, logging out...');
      DevSettings.reload();
      navigationRef.current.reset(ScreenNameEnum.REGISTRATION_SCREEN);
    }
    GAlert(error?.response?.data?.message || error?.message || 'Network Error');
    if (error.response?.statusCode === 401) {
      await sInfoUtil.remove(SInfoTypeEnum.JWT);
      await sInfoUtil.remove(SInfoTypeEnum.USER_CONTEXT);
      navigationRef.current.reset(ScreenNameEnum.REGISTRATION_SCREEN);
    }
    if (error?.message === 'Network Error' && !error.response) {
      error.code = ApiErrorEnum.SERVER_UNREACHABLE;
    } else if (
      error.response?.status === 403 ||
      error.response?.status === 401
    ) {
      error.code = ApiErrorEnum.SECURITY_ERROR;
    } else if (error.response?.status === 404) {
      error.code = ApiErrorEnum.RESOURCE_NOT_FOUND_ERROR;
    } else {
      error.code = ApiErrorEnum.SERVER_ERROR;
    }
    return Promise.reject(error);
  },
);

export default securedApi;
