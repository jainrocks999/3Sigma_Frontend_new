import {ENVIRONMENT, SERVER_URL} from '../../../env';
import SInfoTypeEnum from '../../models/common/sInfoType.enum';
import sInfoUtil from '../../utils/sInfo.util';
import {CallLog} from '../entity/callLog';
import {PaginationQuery, PaginatedResult} from '../entity/paginatedResult';
import {VerifyAuthRequest} from '../entity/requests';
import {Response} from '../entity/response';
import {
  CreateSubscriptionPayload,
  Subscription,
  UserSubscription,
} from '../entity/subscription';
import {UserIntegration} from '../entity/systemIntegration';
import {User, UserProfile} from '../entity/user';
import SecuredBaseApi from '../securedBase.api';

class UserApi extends SecuredBaseApi {
  public async udpateMobileNumber(
    userId: number,
    mobileNumber: string,
  ): Promise<User> {
    const response: Response = await this.securedAxios.put(
      `/user/${userId}/udpateMobileNumber?mobileNumber=${encodeURIComponent(
        mobileNumber,
      )}`,
    );
    return Promise.resolve(response.data);
  }
  public async updateProfile(payload: object): Promise<string> {
    try {
      const response: any = await this.securedAxios.put(
        '/user/update-profile',
        payload,
      );
      if (response && response.status) {
        return Promise.resolve(response);
      }
      return Promise.reject();
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async updatePreference(payload: object): Promise<boolean> {
    try {
      const response: any = await this.securedAxios.put(
        '/user/preference',
        payload,
      );
      return Promise.resolve(response.status);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getUser(): Promise<User> {
    const storedJwt = await sInfoUtil.fetch(SInfoTypeEnum.JWT);
    const response = await fetch(SERVER_URL[ENVIRONMENT] + '/user/profile', {
      method: 'get',
      headers: new Headers({
        Authorization: `Bearer ${storedJwt}`,
        'Content-Type': 'application/json',
      }),
    });
    const responseJson = await response.json();
    return Promise.resolve(responseJson.data);
    //const response: Response = await this.securedAxios.get('/user/profile');
    //return Promise.resolve(response.data);
  }
  public async getUserIntegration(): Promise<Array<UserIntegration>> {
    const response: Response = await this.securedAxios.get(
      '/integration/user-integration',
    );
    return Promise.resolve(response.data);
  }

  public async saveOnBoardData(user: UserProfile): Promise<boolean> {
    const response: Response = await this.securedAxios.post(
      '/user/onboard',
      user,
    );
    return Promise.resolve(response.status);
  }
  public async updteUserProfile(user: any): Promise<boolean> {
    const response: Response = await this.securedAxios.put(
      '/user/profile',
      user,
    );
    return Promise.resolve(response.status);
  }
  public async setFcmToken(token: string): Promise<void> {
    const response: Response = await this.securedAxios.post(
      '/user/add-fcm-token',
      {token},
    );
    return Promise.resolve(response.data);
  }
  public async removeFcmToken(): Promise<void> {
    const response: Response = await this.securedAxios.post(
      '/user/remove-fcm-token',
      {},
    );
    return Promise.resolve(response.data);
  }
  public async deleteMyAccount(): Promise<boolean> {
    const response: Response = await this.securedAxios.delete('/user');
    return Promise.resolve(response.status);
  }
  public async deleteEmployeeAccount(userId: string): Promise<boolean> {
    const response: Response = await this.securedAxios.delete(
      `/user/employee/${userId}`,
    );
    return Promise.resolve(response.status);
  }

  public async getUserSubscription(): Promise<UserSubscription> {
    const response: Response = await this.securedAxios.get('/subscription');
    return Promise.resolve(response.data);
  }
  public async exportLeads(): Promise<boolean> {
    const response: Response = await this.securedAxios.get(
      '/user/export-leads',
    );
    return Promise.resolve(response.status);
  }
  public async createUserSubscription(
    payload: CreateSubscriptionPayload,
  ): Promise<UserSubscription> {
    const response: Response = await this.securedAxios.post(
      '/subscription',
      payload,
    );
    return Promise.resolve(response.data);
  }
  public async createStripeSubscription(
    payload: CreateSubscriptionPayload,
  ): Promise<UserSubscription> {
    const response: Response = await this.securedAxios.post(
      '/subscription/purchase',
      payload,
    );
    return Promise.resolve(response.data);
  }
  public async getSubscriptionPlan(): Promise<Array<Subscription>> {
    const response: Response = await this.securedAxios.get(
      '/subscription/plan',
    );
    return Promise.resolve(response.data);
  }
  public async updateUserSubscription({
    subscriptionId,
    extraUser,
  }: {
    subscriptionId: string;
    extraUser: number;
  }): Promise<boolean> {
    const response: Response = await this.securedAxios.put(
      `/subscription/${subscriptionId}`,
      {extraUser},
    );
    return Promise.resolve(response.data);
  }

  public async cancelUserSubscription(options: {
    id: string;
    isImmediately: boolean;
  }): Promise<boolean> {
    const response: Response = await this.securedAxios.put(
      `/subscription/cancel/${options.id}`,
      {isImmediately: options.isImmediately},
    );
    return Promise.resolve(response.status);
  }
  public async verifyMobile(payload: any): Promise<boolean> {
    const response: Response = await this.securedAxios.post(
      '/user/verify-phone',
      payload,
    );
    return Promise.resolve(response.status);
  }
  public async sendEmailLink(email: string): Promise<boolean> {
    const response: Response = await this.securedAxios.post(
      '/user/resend-email',
      email,
    );
    return Promise.resolve(response.status);
  }
  public async verifyPhone(requestBody: VerifyAuthRequest) {
    const response: Response = await this.securedAxios.post(
      'user/verify-phone',
      requestBody,
    );
    return Promise.resolve(response);
  }
  public async getReferredUser(): Promise<Array<object>> {
    const response: Response = await this.securedAxios.get(
      'user/referred-users',
    );
    return Promise.resolve(response.data);
  }
  public async getCallLogs(
    queryFilter: PaginationQuery,
  ): Promise<PaginatedResult<CallLog, number>> {
    const response: PaginatedResult<CallLog, number> =
      await this.securedAxios.get(
        '/user/call-logs?' + this.bindQueryParams(queryFilter),
      );
    return Promise.resolve(response);
  }
  public async logout(requestBody: {
    isAllEmployees: boolean;
    isAllDevice: boolean;
  }): Promise<boolean> {
    const response: Response = await this.securedAxios.post(
      'auth/logout',
      requestBody,
    );
    return Promise.resolve(response.status);
  }
}

export default UserApi;
