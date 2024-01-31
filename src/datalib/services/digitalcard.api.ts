import SecuredBaseApi from '../securedBase.api';
import {Response} from '../entity/response';
import {Digitalcard} from '../entity/digitalcard';

class DigitalCardApi extends SecuredBaseApi {
  public async createDigitalCard(payload: Digitalcard): Promise<Digitalcard> {
    const response: Response = await this.securedAxios.post(
      '/digital-card',
      payload,
    );
    return Promise.resolve(response.data);
  }
  public async getDigitalCardById(): Promise<Digitalcard> {
    const response: Response = await this.securedAxios.get('/digital-card/');
    return Promise.resolve(response.data);
  }
  public async updateDigitalCard(payload: Digitalcard): Promise<boolean> {
    const id = payload._id;
    delete payload._id;
    const response: Response = await this.securedAxios.put(
      `/digital-card/${id}`,
      payload,
    );
    return Promise.resolve(response.status);
  }
}

export default DigitalCardApi;
