import {Activity} from '../entity/activity';
import {PaginatedResult, PaginationQuery} from '../entity/paginatedResult';
import SecuredBaseApi from '../securedBase.api';
import {Response} from '../entity/response';

class ActivityApi extends SecuredBaseApi {
  public async getActivities(
    queryFilter: PaginationQuery,
  ): Promise<PaginatedResult<Activity, number>> {
    const response: PaginatedResult<Activity, number> =
      await this.securedAxios.get(
        '/activity?' + this.bindQueryParams(queryFilter),
      );
    return Promise.resolve(response);
  }
  public async createActivity(payload: Activity): Promise<Activity> {
    const response: Response = await this.securedAxios.post(
      '/activity',
      payload,
    );
    return Promise.resolve(response.data);
  }
  public async getActivityById(activitId: string): Promise<Activity> {
    const response: Response = await this.securedAxios.get(
      '/activity/' + activitId,
    );
    return Promise.resolve(response.data);
  }
  public async updateActivity(payload: Activity): Promise<boolean> {
    const id = payload._id;
    delete payload._id;
    const response: Response = await this.securedAxios.put(
      `/activity/${id}`,
      payload,
    );
    return Promise.resolve(response.status);
  }
  public async deleteActivity(list: string): Promise<boolean> {
    const response: Response = await this.securedAxios.delete(
      `/activity/${list}`,
    );
    return Promise.resolve(response.status);
  }
  public async syncActivity(payload: any): Promise<any> {
    const response: Response = await this.securedAxios.post(
      '/activity/sync',
      payload,
    );
    return Promise.resolve(response);
  }
}

export default ActivityApi;
