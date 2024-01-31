import SecuredBaseApi from 'datalib/securedBase.api';
import {PaginationMetadata} from '../entity/paginatedResult';
class DashboardApi extends SecuredBaseApi {
  public async getCountByStatus(
    queryFilter: PaginationMetadata<number>,
  ): Promise<any> {
    const response: any = await this.securedAxios.get(
      '/dashboard/status-count?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response.data);
  }
  public async getChartData(
    queryFilter: PaginationMetadata<number>,
  ): Promise<any> {
    const response: any = await this.securedAxios.get(
      '/dashboard/graph-data?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response.data);
  }
  public async getCountByLabel(
    queryFilter: PaginationMetadata<number>,
  ): Promise<any> {
    const response: any = await this.securedAxios.get(
      '/dashboard/label-count?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response.data);
  }
  public async getActivityCount(
    queryFilter: PaginationMetadata<number>,
  ): Promise<any> {
    const response: any = await this.securedAxios.get(
      '/dashboard/all-activities-count?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response.data);
  }
  public async getLeadCount(
    queryFilter: PaginationMetadata<number>,
  ): Promise<any> {
    const response: any = await this.securedAxios.get(
      '/dashboard/lead-count?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response.data);
  }
  public async getSaleValueCount(
    queryFilter: PaginationMetadata<number>,
  ): Promise<any> {
    const response: any = await this.securedAxios.get(
      '/dashboard/sales-value-count?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response.data);
  }
  public async getCountByIntegrtion(
    queryFilter: PaginationMetadata<number>,
  ): Promise<any> {
    const response: any = await this.securedAxios.get(
      '/dashboard/integration-count?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response.data);
  }
  public async getCheckInsCount(
    queryFilter: PaginationMetadata<number>,
  ): Promise<any> {
    const response: any = await this.securedAxios.get(
      '/dashboard/check-in?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response.data);
  }
}

export default DashboardApi;
