import getApiUri from '../api.util';
import {Response} from '../entity/response';
import {Order} from '../entity/order';
import SecuredBaseApi from '../securedBase.api';

class PaymentApi extends SecuredBaseApi {
  public async initPayment(orderId: string): Promise<Order> {
    const response: Response = await this.securedAxios.post(
      `/payment/init-payment`,
      {orderId},
    );
    return Promise.resolve(response.data);
  }
  public async completePayment(
    paymentId: string,
    order_id: string,
  ): Promise<Order> {
    const response: Response = await this.securedAxios.post(
      `/payment/complete-payment`,
      {paymentId, order_id},
    );
    return Promise.resolve(response.data);
  }
}

export default PaymentApi;
