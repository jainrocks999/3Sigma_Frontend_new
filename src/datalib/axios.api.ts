import axios, {AxiosResponse} from 'axios';
import {SERVER_URL, ENVIRONMENT} from '../../env';
import logger from 'library/hooks/logger';
import GAlert from 'library/common/GAlert';
import ApiErrorEnum from './apiError.enum';

const api = axios.create({
  baseURL: SERVER_URL[ENVIRONMENT],
});
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: any) => {
    console.log('Error message 1 - ', error.response.data?.message, error);
    logger.error(error);
    logger.log(
      error?.response?.data?.message || error?.message || 'Network Error',
    );
    GAlert(error?.response?.data?.message || error?.message || 'Network Error');

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
export default api;
