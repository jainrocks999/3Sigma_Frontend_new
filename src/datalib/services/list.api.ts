import SecuredBaseApi from '../securedBase.api';
import {Response} from '../entity/response';
import {PaginatedResult, PaginationQuery} from '../entity/paginatedResult';
import {List} from '../entity/List';

class ListApi extends SecuredBaseApi {
  public async getAllLists(
    queryFilter: PaginationQuery,
  ): Promise<PaginatedResult<List, number>> {
    const response: PaginatedResult<List, number> = await this.securedAxios.get(
      '/lead-list?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response);
  }

  public async createList(values: List): Promise<List> {
    const response: Response = await this.securedAxios.post(
      '/lead-list',
      values,
    );
    return Promise.resolve(response.data);
  }
  public async updateList(values: List): Promise<boolean> {
    const id = values._id;
    delete values._id;
    const response: Response = await this.securedAxios.put(
      `/lead-list/${id}`,
      values,
    );
    return Promise.resolve(response.status);
  }
  public async deleteList(list: string): Promise<boolean> {
    const response: Response = await this.securedAxios.delete(
      `/lead-list/${list}`,
    );
    return Promise.resolve(response.status);
  }
}

export default ListApi;
