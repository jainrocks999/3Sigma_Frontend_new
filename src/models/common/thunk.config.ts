import {ThunkResultEnum, ThunkStatusEnum} from './thunkStatus.enum';
import {ThunkStatus} from './thunkStatus.interface';

export const defaultThunkLoadingState: ThunkStatus = {
  error: null,
  result: void 0,
  status: ThunkStatusEnum.LOADING,
};

export const defaultThunkSuccessState: ThunkStatus = {
  error: null,
  result: ThunkResultEnum.SUCCESS,
  status: ThunkStatusEnum.LOADED,
};

export const defaultThunkFailureState: ThunkStatus = {
  result: ThunkResultEnum.FAILURE,
  status: ThunkStatusEnum.IDLE,
};
