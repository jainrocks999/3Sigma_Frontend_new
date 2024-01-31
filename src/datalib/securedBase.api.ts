import {AxiosInstance} from 'axios';
import securedApi from './axiosSecured.api';

class SecuredBaseApi {
  public securedAxios: AxiosInstance = securedApi;
  public bindQueryParams: Function = (obj: Object) => {
    try {
      let str = [];
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          if (Array.isArray(obj[p])) {
            obj[p].map((item: string) => {
              str.push(encodeURIComponent(p) + '[]=' + item);
            });
          } else {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          }
        }
      }
      return str.join('&');
    } catch (error) {
      console.log('error', error);
    }
    return '';
  };
}

export default SecuredBaseApi;
