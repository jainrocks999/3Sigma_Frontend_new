import SecuredBaseApi from '../securedBase.api';
import {Response} from '../entity/response';
import {DistributionConfig, DistributionRule} from '../entity/distribution';

class DistributionApi extends SecuredBaseApi {
  public async getDistribution(): Promise<DistributionConfig> {
    const response: Response = await this.securedAxios.get(
      '/lead-distribution/config',
    );
    return Promise.resolve(response.data);
  }
  public async updateDistributionConfig(
    payload: DistributionConfig,
  ): Promise<boolean> {
    const response: Response = await this.securedAxios.post(
      '/lead-distribution/config',
      payload,
    );
    return Promise.resolve(response.status);
  }

  public async deleteDistributionRule(ruleId: string): Promise<boolean> {
    const response: Response = await this.securedAxios.delete(
      `/lead-distribution/rule/${ruleId}`,
    );
    return Promise.resolve(response.data);
  }
  public async getDistributionRules(): Promise<Array<DistributionRule>> {
    const response: Response = await this.securedAxios.get(
      '/lead-distribution/rule',
    );
    return Promise.resolve(response.data);
  }
  public async updateDistributionRule(
    rule: DistributionRule,
  ): Promise<boolean> {
    const id = rule._id;
    delete rule._id;
    const response: Response = await this.securedAxios.put(
      `/lead-distribution/rule/${id}`,
      rule,
    );
    return Promise.resolve(response.status);
  }

  public async createDistributionRule(
    rule: DistributionRule,
  ): Promise<DistributionRule> {
    const response: Response = await this.securedAxios.post(
      '/lead-distribution/rule',
      rule,
    );
    return Promise.resolve(response.data);
  }
  public async getDistributionOptions(): Promise<object> {
    const response: Response = await this.securedAxios.get(
      '/lead-distribution/options-values',
    );
    return Promise.resolve(response.data);
  }
}

export default DistributionApi;
