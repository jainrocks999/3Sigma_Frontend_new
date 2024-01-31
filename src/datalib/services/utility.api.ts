import SecuredBaseApi from '../securedBase.api';
import {Response} from '../entity/response';
class UtilityApi extends SecuredBaseApi {
  public async sendEmailByGoogle(payload: any): Promise<boolean> {
    const response: Response = await this.securedAxios.post(
      '/utility/send-mail-by-google',
      payload,
    );
    return Promise.resolve(response.status);
  }
}

export default UtilityApi;
