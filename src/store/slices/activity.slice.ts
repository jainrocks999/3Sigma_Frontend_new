import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import {Activity} from 'datalib/entity/activity';

import {PaginatedResult, PaginationQuery} from 'datalib/entity/paginatedResult';
import ActivityApi from 'datalib/services/activity.api';

import {
  defaultThunkFailureState,
  defaultThunkLoadingState,
  defaultThunkSuccessState,
} from '../../models/common/thunk.config';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {ThunkStatus} from '../../models/common/thunkStatus.interface';
import {RootState} from '../app.store';
import Helper from '../../utils/helper';

const activityAdapter = createEntityAdapter<Activity>({
  selectId: activity => activity._id || '',
});

const initialThunkState: ThunkStatus = {
  status: ThunkStatusEnum.IDLE,
  error: null,
};

export const initialActivityPaginationMetaData: PaginationQuery = {
  orderBy: 'performedAt',
  isAscending: false,
  page: 1,
  perPage: 50,
};

const initialState: ActiviyState = activityAdapter.getInitialState({
  total: 0,
  paginationMetadata: initialActivityPaginationMetaData,
  findActivitysStatus: initialThunkState,
  updateActivitysStatus: initialThunkState,
});
interface ActiviyState extends EntityState<Activity> {
  total: number;
  paginationMetadata: PaginationQuery;
  findActivitysStatus: ThunkStatus;
  updateActivitysStatus: ThunkStatus;
}

export const getAllActivity = createAsyncThunk<
  PaginatedResult<Activity, number>,
  PaginationQuery,
  {rejectValue: string}
>('/activity-get-all', async (task: PaginationQuery, {rejectWithValue}) => {
  try {
    return await new ActivityApi().getActivities(task);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const createActivity = createAsyncThunk<
  Activity,
  Activity,
  {rejectValue: string}
>('/activity-create', async (task: Activity, {rejectWithValue}) => {
  try {
    return await new ActivityApi().createActivity(task);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const getActivityById = createAsyncThunk<
  Activity,
  string,
  {rejectValue: string}
>('/activity-find-by-id', async (activityId: string, {rejectWithValue}) => {
  try {
    return await new ActivityApi().getActivityById(activityId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateActivity = createAsyncThunk<
  boolean,
  Activity,
  {rejectValue: string}
>('/activity-update', async (task: Activity, {rejectWithValue}) => {
  try {
    return await new ActivityApi().updateActivity(task);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const deleteActivity = createAsyncThunk<
  boolean,
  string,
  {rejectValue: string}
>('/activity-delete', async (taskId: string, {rejectWithValue}) => {
  try {
    return await new ActivityApi().deleteActivity(taskId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

const taskSlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    restoreActivityStore: () => initialState,
  },
  extraReducers: builder => {
    // add activity response Data
    builder.addCase(getAllActivity.pending, state => {
      state.findActivitysStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(getAllActivity.fulfilled, (state, action) => {
      state.findActivitysStatus = defaultThunkSuccessState;
      const {data, total} = action.payload;
      state.total = total;
      console.log('getAllActivity', action.meta.arg);
      state.paginationMetadata = action.meta.arg;
      if (action.meta.arg.page === 1) {
        activityAdapter.setAll(state, data);
      } else {
        activityAdapter.upsertMany(state, data);
      }
    });
    builder.addCase(getAllActivity.rejected, (state, action) => {
      state.findActivitysStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(createActivity.pending, state => {
      state.updateActivitysStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(createActivity.fulfilled, (state, action) => {
      state.updateActivitysStatus = defaultThunkSuccessState;
      activityAdapter.addOne(state, action.payload);
    });
    builder.addCase(createActivity.rejected, (state, action) => {
      state.updateActivitysStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(updateActivity.pending, state => {
      state.updateActivitysStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(updateActivity.fulfilled, (state, action) => {
      state.updateActivitysStatus = defaultThunkSuccessState;
      activityAdapter.updateOne(state, action.meta.arg);
    });
    builder.addCase(updateActivity.rejected, (state, action) => {
      state.updateActivitysStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(getActivityById.pending, state => {
      state.findActivitysStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(getActivityById.fulfilled, (state, action) => {
      state.findActivitysStatus = defaultThunkSuccessState;
      if (action.payload) {
        activityAdapter.upsertOne(state, action.payload);
      }
    });
    builder.addCase(getActivityById.rejected, (state, action) => {
      state.findActivitysStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(deleteActivity.pending, state => {
      state.updateActivitysStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(deleteActivity.fulfilled, (state, action) => {
      state.updateActivitysStatus = defaultThunkSuccessState;
      activityAdapter.removeOne(state, action.meta.arg);
    });
    builder.addCase(deleteActivity.rejected, (state, action) => {
      state.updateActivitysStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export const {restoreActivityStore} = taskSlice.actions;
export default taskSlice.reducer;

export const {
  selectAll: selectAllActivities,
  selectById: selectActivityById,
  selectIds: selectActivityIds,
} = activityAdapter.getSelectors<RootState>(state => state.activity);

export const selectActivitiesByLead = createSelector(
  [selectAllActivities, (state: RootState, leadId: string) => leadId],
  (activities: Array<Activity>, leadId: string) =>
    activities
      .filter(_c => _c.lead && _c.lead._id === leadId)
      .sort(
        (a, b) =>
          new Date(b?.performedAt).getTime() -
          new Date(a?.performedAt).getTime(),
      ),
);
export const getSectionActivities = createSelector(
  [selectAllActivities],
  activities => Helper.formatDataSectionWise(activities, 'performedAt'),
);
