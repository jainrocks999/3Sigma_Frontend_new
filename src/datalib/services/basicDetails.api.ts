import SecuredBaseApi from 'datalib/securedBase.api';
import {DashBoard} from '../entity/dashBoard';

class BasicDetailsApi extends SecuredBaseApi {
  public async basicDetailsAdd(data): Promise<DashBoard> {
    let {firstName, lastName, email, phone} = data;
    const response: Response = await this.securedAxios.put(`user/profile`, {
      firstName,
      lastName,
      email,
      phone,
    });
    return Promise.resolve(`user/profile`, response.data);
  }
}

export default BasicDetailsApi;
