export interface Subscription {
  _id: string;
  name?: string;
  planId?: string;
  amount?: 0;
  currency?: string;
  period?: string;
  interval?: string;
  subscriptionId?: string;
  status?: string;
  isTrail?: boolean;
  extraDetails?: {};
}
export interface UserSubscription {
  _id: string;
  subscriptionPlan: string;
  customerId: string;
  createdBy: string;
  subscriptionId: string;
  offerId: string;
  totalCount: number;
  quantity: number;
  status: string;
  nextChargeDate: string;
  extraDetails: any;
  isTrail: boolean;
  trailStartedAt: any;
  trailEndedAt: any;
}
export interface CreateSubscriptionPayload {
  isTrail?: boolean;
  plan?: string;
  quantity?: number;
  offerId?: string;
}
