import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

import {PaginationMetadata} from 'datalib/entity/paginatedResult';

import DashboardApi from 'datalib/services/dashBoard.api';
import moment from 'moment';
import {
  defaultThunkFailureState,
  defaultThunkLoadingState,
  defaultThunkSuccessState,
} from '../../models/common/thunk.config';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {ThunkStatus} from '../../models/common/thunkStatus.interface';
import {DashBoard, DashboardFilterParams} from 'datalib/entity/dashBoard';

const dashboardAdapter = createEntityAdapter<DashBoard>({
  selectId: content => content._id || '',
});

const initialThunkState: ThunkStatus = {
  status: ThunkStatusEnum.IDLE,
  error: null,
};
export const initialFilterParams: PaginationMetadata<number> = {
  fromDate: moment().subtract(7, 'days').toISOString(),
  toDate: moment().toISOString(),
};
export const initialFilterValues: DashboardFilterParams = {
  duration: 7,
  fromDate: moment().subtract(7, 'days').utc().toISOString(),
  toDate: moment().utc().toISOString(),
};
const initialState: DashboardState = dashboardAdapter.getInitialState({
  paramsMetadata: initialFilterParams,
  filterMetadata: initialFilterValues,
  activities: {
    activityTypes: [],
    callingCount: [],
    callingDetails: null,
    totalActivity: 0,
  },
  leads: 0,
  totalSaleValue: 0,
  checkins: [],
  leadsByStatus: [],
  leadsByLabel: [],
  leadsBySource: [],
  chartData: [],
  fetchActivitiesStatus: initialThunkState,
  fetchIntegrationStatus: initialThunkState,
  fetchLeadsStatus: initialThunkState,
  fetchCheckinsStatus: initialThunkState,
  fetchLeadsByStatus: initialThunkState,
  fetchLeadsByLabels: initialThunkState,
  fetchLeadsBySaleValue: initialThunkState,
  fetchChartDataStatus: initialThunkState,
  isFilterApplied: false,
});
interface DashboardState extends EntityState<DashBoard> {
  paramsMetadata: PaginationMetadata<number>;
  filterMetadata: DashboardFilterParams;
  activities: {
    activityTypes: Array<{type: string; count: number}>;
    callingCount: Array<{type: string; count: number}>;
    callingDetails: any;
    totalActivity: number;
  };
  leads: any;
  totalSaleValue: any;
  checkins: any;
  leadsByStatus: any;
  leadsByLabel: any;
  leadsBySource: any;
  chartData: any;
  fetchActivitiesStatus: ThunkStatus;
  fetchLeadsStatus: ThunkStatus;
  fetchIntegrationStatus: ThunkStatus;
  fetchCheckinsStatus: ThunkStatus;
  fetchLeadsByStatus: ThunkStatus;
  fetchLeadsByLabels: ThunkStatus;
  fetchLeadsBySaleValue: ThunkStatus;
  fetchChartDataStatus: ThunkStatus;
  isFilterApplied: boolean;
}

export const getLeadCountByStatus = createAsyncThunk<
  any,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'dashboard/get-status-count',
  async (paginatedQuey: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new DashboardApi().getCountByStatus(paginatedQuey);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getChartData = createAsyncThunk<
  any,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'dashboard/get-chart-count',
  async (paginatedQuey: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new DashboardApi().getChartData(paginatedQuey);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getLeadCountByLabel = createAsyncThunk<
  any,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'dashboard/get-label-count',
  async (paginatedQuey: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new DashboardApi().getCountByLabel(paginatedQuey);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getActivityCounts = createAsyncThunk<
  any,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'dashboard/get-activity-count',
  async (paginatedQuey: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new DashboardApi().getActivityCount(paginatedQuey);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getCountByIntegration = createAsyncThunk<
  any,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'dashboard/get-integration-count',
  async (paginatedQuey: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new DashboardApi().getCountByIntegrtion(paginatedQuey);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getAllCheckIns = createAsyncThunk<
  any,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'dashboard/get-all-checkins',
  async (paginatedQuey: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new DashboardApi().getCheckInsCount(paginatedQuey);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getAllLeadCounts = createAsyncThunk<
  any,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'dashboard/get-lead-count',
  async (paginatedQuey: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new DashboardApi().getLeadCount(paginatedQuey);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getBySaleValue = createAsyncThunk<
  any,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'dashboard/get-count-by-salevalue',
  async (paginatedQuey: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new DashboardApi().getSaleValueCount(paginatedQuey);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    restoreDashboardStore: () => initialState,
    toggleFilterStatus: (state, action: PayloadAction<boolean>) => {
      state.isFilterApplied = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getLeadCountByStatus.pending, state => {
      state.fetchActivitiesStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(getLeadCountByStatus.fulfilled, (state, action) => {
      state.fetchActivitiesStatus = defaultThunkSuccessState;
      state.leadsByStatus = action.payload;
    });
    builder.addCase(getLeadCountByStatus.rejected, (state, action) => {
      state.fetchActivitiesStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getLeadCountByLabel.pending, state => {
      state.fetchLeadsByLabels = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(getLeadCountByLabel.fulfilled, (state, action) => {
      state.fetchLeadsByLabels = defaultThunkSuccessState;
      state.leadsByLabel = action.payload;
    });
    builder.addCase(getLeadCountByLabel.rejected, (state, action) => {
      state.fetchLeadsByLabels = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getActivityCounts.pending, state => {
      state.fetchActivitiesStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(getActivityCounts.fulfilled, (state, action) => {
      state.fetchActivitiesStatus = defaultThunkSuccessState;
      state.activities = action.payload || [];
    });
    builder.addCase(getActivityCounts.rejected, (state, action) => {
      state.fetchActivitiesStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getCountByIntegration.pending, state => {
      state.fetchIntegrationStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(getCountByIntegration.fulfilled, (state, action) => {
      state.fetchIntegrationStatus = defaultThunkSuccessState;
      state.leadsBySource = action.payload;
    });
    builder.addCase(getCountByIntegration.rejected, (state, action) => {
      state.fetchIntegrationStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getAllCheckIns.pending, state => {
      state.fetchCheckinsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(getAllCheckIns.fulfilled, (state, action) => {
      state.fetchCheckinsStatus = defaultThunkSuccessState;
      state.checkins = action.payload;
    });
    builder.addCase(getAllCheckIns.rejected, (state, action) => {
      state.fetchCheckinsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getAllLeadCounts.pending, state => {
      state.fetchLeadsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(getAllLeadCounts.fulfilled, (state, action) => {
      state.fetchLeadsStatus = defaultThunkSuccessState;
      state.leads = action.payload?.count?.totalLead || 0;
      state.paramsMetadata = action.meta.arg;
    });
    builder.addCase(getAllLeadCounts.rejected, (state, action) => {
      state.fetchLeadsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getBySaleValue.pending, state => {
      state.fetchLeadsBySaleValue = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(getBySaleValue.fulfilled, (state, action) => {
      state.fetchLeadsBySaleValue = defaultThunkSuccessState;
      state.totalSaleValue = action.payload?.salesValue || 0;
    });
    builder.addCase(getBySaleValue.rejected, (state, action) => {
      state.fetchLeadsBySaleValue = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getChartData.pending, state => {
      state.fetchChartDataStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(getChartData.fulfilled, (state, action) => {
      state.fetchChartDataStatus = defaultThunkSuccessState;
      state.chartData = action.payload;
    });
    builder.addCase(getChartData.rejected, (state, action) => {
      state.fetchChartDataStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export const {restoreDashboardStore, toggleFilterStatus} =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
