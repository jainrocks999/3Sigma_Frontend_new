import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  CreateSubscriptionPayload,
  Subscription,
  UserSubscription,
} from 'datalib/entity/subscription';
import UserApi from 'datalib/services/user.api';

export const getSubscriptionPlan = createAsyncThunk<
  Array<Subscription>,
  void,
  {rejectValue: string}
>('subscription/get-plan', async (user, {rejectWithValue}) => {
  try {
    return await new UserApi().getSubscriptionPlan();
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const getUserSubscription = createAsyncThunk<
  UserSubscription,
  void,
  {rejectValue: string}
>('subscription/get-user-subscription', async (_user, {rejectWithValue}) => {
  try {
    return await new UserApi().getUserSubscription();
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateUserSubscription = createAsyncThunk<
  boolean,
  {
    subscriptionId: string;
    extraUser: number;
  },
  {rejectValue: string}
>(
  'subscription/update-subscription',
  async (
    payload: {
      subscriptionId: string;
      extraUser: number;
    },
    {rejectWithValue},
  ) => {
    try {
      return await new UserApi().updateUserSubscription(payload);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const createUserSubscription = createAsyncThunk<
  UserSubscription,
  CreateSubscriptionPayload,
  {rejectValue: string}
>(
  'subscription/create-subscription',
  async (payload: CreateSubscriptionPayload, {rejectWithValue}) => {
    try {
      return await new UserApi().createUserSubscription(payload);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const createStripeSubscription = createAsyncThunk<
  UserSubscription,
  CreateSubscriptionPayload,
  {rejectValue: string}
>(
  'subscription/create-subscription',
  async (payload: CreateSubscriptionPayload, {rejectWithValue}) => {
    try {
      return await new UserApi().createStripeSubscription(payload);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const cancelUserSubscription = createAsyncThunk<
  boolean,
  {id: string; isImmediately: boolean},
  {rejectValue: string}
>(
  'subscription/cancel-subscription',
  async (options: {id: string; isImmediately: boolean}, {rejectWithValue}) => {
    try {
      return await new UserApi().cancelUserSubscription(options);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
