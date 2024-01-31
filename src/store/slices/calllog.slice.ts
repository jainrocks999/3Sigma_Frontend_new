import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

import {PaginatedResult, PaginationQuery} from 'datalib/entity/paginatedResult';

import {
  defaultThunkFailureState,
  defaultThunkLoadingState,
  defaultThunkSuccessState,
} from '../../models/common/thunk.config';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {ThunkStatus} from '../../models/common/thunkStatus.interface';
import {RootState} from '../app.store';
import {CallLog} from 'datalib/entity/callLog';
import UserApi from 'datalib/services/user.api';
import Helper from '../../utils/helper';

const calllogAdapter = createEntityAdapter<CallLog>({
  selectId: activity => activity._id || '',
});

const initialThunkState: ThunkStatus = {
  status: ThunkStatusEnum.IDLE,
  error: null,
};

export const initialCalllogPaginationMetaData: PaginationQuery = {
  orderBy: 'startedAt',
  isAscending: false,
  page: 1,
  perPage: 50,
};

const initialState: CalllogState = calllogAdapter.getInitialState({
  findCalllogStatus: initialThunkState,
  paginationMetadata: initialCalllogPaginationMetaData,
  total: 0,
});
interface CalllogState extends EntityState<CallLog> {
  findCalllogStatus: ThunkStatus;
  paginationMetadata: PaginationQuery;
  total: number;
}

export const getAllCallLogs = createAsyncThunk<
  PaginatedResult<CallLog, number>,
  PaginationQuery,
  {rejectValue: string}
>('/calllog-get-all', async (payload: PaginationQuery, {rejectWithValue}) => {
  try {
    return await new UserApi().getCallLogs(payload);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

const callLogSlice = createSlice({
  name: 'calllog',
  initialState,
  reducers: {
    restoreCalllogStore: () => initialState,
  },
  extraReducers: builder => {
    // add activity response Data
    builder.addCase(getAllCallLogs.pending, state => {
      state.findCalllogStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(getAllCallLogs.fulfilled, (state, action) => {
      state.findCalllogStatus = defaultThunkSuccessState;
      const {data} = action.payload;
      state.total = action.payload.total;
      state.paginationMetadata.page = action.payload.page;
      console.log(action.payload);
      if (action.payload.page === 1) {
        calllogAdapter.setAll(state, data);
      } else {
        calllogAdapter.upsertMany(state, data);
      }
    });
    builder.addCase(getAllCallLogs.rejected, (state, action) => {
      state.findCalllogStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export const {restoreCalllogStore} = callLogSlice.actions;
export default callLogSlice.reducer;

export const {
  selectAll: selectAllLogs,
  selectById: selectLogsById,
  selectIds: selectLogIds,
} = calllogAdapter.getSelectors<RootState>(state => state.calllog);

export const getSectionLogs = createSelector([selectAllLogs], logs =>
  Helper.formatDataSectionWise(logs),
);
