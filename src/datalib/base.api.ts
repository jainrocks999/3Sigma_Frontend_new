import {AxiosInstance} from 'axios';
import api from './axios.api';

class BaseApi {
  public axios: AxiosInstance = api;
}

export default BaseApi;
