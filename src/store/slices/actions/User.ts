import {createAsyncThunk} from '@reduxjs/toolkit';
import UserApi from 'datalib/services/user.api';

export const logout = createAsyncThunk<
  boolean,
  {
    isAllEmployees: boolean;
    isAllDevice: boolean;
  },
  {rejectValue: string}
>('user/logout', async (payload, {rejectWithValue}) => {
  try {
    return await new UserApi().logout(payload);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const getReferredUsers = createAsyncThunk<
  Array<object>,
  void,
  {rejectValue: string}
>('user/get-referred-users', async (payload, {rejectWithValue}) => {
  try {
    return await new UserApi().getReferredUser();
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
