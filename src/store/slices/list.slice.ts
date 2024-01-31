import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import {
  DistributionConfig,
  DistributionRule,
} from 'datalib/entity/distribution';
import {List} from 'datalib/entity/list';

import {
  PaginatedResult,
  PaginationMetadata,
  PaginationQuery,
} from 'datalib/entity/paginatedResult';
import DistributionApi from 'datalib/services/distribution.api';
import ListApi from 'datalib/services/list.api';
import GAlert, {MessageType} from 'library/common/GAlert';

import {
  defaultThunkFailureState,
  defaultThunkLoadingState,
  defaultThunkSuccessState,
} from '../../models/common/thunk.config';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {ThunkStatus} from '../../models/common/thunkStatus.interface';
import {Nillable} from '../../models/custom.types';
import {RootState} from '../app.store';

const listAdapter = createEntityAdapter<List>({
  selectId: list => list._id || '',
});

const initialThunkState: ThunkStatus = {
  status: ThunkStatusEnum.IDLE,
  error: null,
};

export const initialPaginationMetaData: PaginationMetadata<number> = {
  orderBy: '_id',
  isAscending: true,
  page: 1,
  perPage: 200,
};

const initialState: ListState = listAdapter.getInitialState({
  findListsStatus: initialThunkState,
  updateListsStatus: initialThunkState,
  updateDistributionConfigStatus: initialThunkState,
  updateDistributionRuleStatus: initialThunkState,
  fetchDistributionRuleStatus: initialThunkState,
  fetchDistributionConfig: initialThunkState,
  distributionConfig: null,
  distributionRules: [],
});
interface ListState extends EntityState<List> {
  findListsStatus: ThunkStatus;
  updateListsStatus: ThunkStatus;
  updateDistributionConfigStatus: ThunkStatus;
  updateDistributionRuleStatus: ThunkStatus;
  fetchDistributionRuleStatus: ThunkStatus;
  fetchDistributionConfig: ThunkStatus;
  distributionConfig: Nillable<DistributionConfig>;
  distributionRules: Array<DistributionRule>;
}

export const getAllList = createAsyncThunk<
  PaginatedResult<List, number>,
  PaginationQuery,
  {rejectValue: string}
>('/list-get-all', async (list: PaginationQuery, {rejectWithValue}) => {
  try {
    return await new ListApi().getAllLists(list);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const createList = createAsyncThunk<List, List, {rejectValue: string}>(
  '/list-create',
  async (list: List, {rejectWithValue}) => {
    try {
      return await new ListApi().createList(list);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const updateList = createAsyncThunk<
  boolean,
  List,
  {rejectValue: string}
>('/list-update', async (list: List, {rejectWithValue}) => {
  try {
    return await new ListApi().updateList(list);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const deleteList = createAsyncThunk<
  boolean,
  string,
  {rejectValue: string}
>('/list-delete', async (list: string, {rejectWithValue}) => {
  try {
    return await new ListApi().deleteList(list);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

export const getDistributionConfig = createAsyncThunk<
  DistributionConfig,
  void,
  {rejectValue: string}
>('/get-distribution', async (undefined, {rejectWithValue}) => {
  try {
    return await new DistributionApi().getDistribution();
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateDistributionConfig = createAsyncThunk<
  boolean,
  DistributionConfig,
  {rejectValue: string}
>(
  '/update-distribution',
  async (distribution: DistributionConfig, {rejectWithValue}) => {
    try {
      return await new DistributionApi().updateDistributionConfig(distribution);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getDistributionRules = createAsyncThunk<
  Array<DistributionRule>,
  void,
  {rejectValue: string}
>('/get-distribution-rule', async (undefined, {rejectWithValue}) => {
  try {
    return await new DistributionApi().getDistributionRules();
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const getDistributionOptions = createAsyncThunk<
  object,
  void,
  {rejectValue: string}
>('/get-distribution-rule', async (undefined, {rejectWithValue}) => {
  try {
    return await new DistributionApi().getDistributionOptions();
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateDistributionRule = createAsyncThunk<
  boolean,
  DistributionRule,
  {rejectValue: string}
>(
  '/update-distribution-rule',
  async (distribution: DistributionRule, {rejectWithValue}) => {
    try {
      return await new DistributionApi().updateDistributionRule(distribution);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const deleteDistributionRule = createAsyncThunk<
  boolean,
  string,
  {rejectValue: string}
>('/delete-distribution-rule', async (ruleId: string, {rejectWithValue}) => {
  try {
    return await new DistributionApi().deleteDistributionRule(ruleId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const createDistributionRule = createAsyncThunk<
  DistributionRule,
  DistributionRule,
  {rejectValue: string}
>(
  '/create-distribution-rule',
  async (distribution: DistributionRule, {rejectWithValue}) => {
    try {
      return await new DistributionApi().createDistributionRule(distribution);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);

const listSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    restoreListStore: () => initialState,
  },
  extraReducers: builder => {
    // add list response Data
    builder.addCase(getAllList.pending, state => {
      state.findListsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(getAllList.fulfilled, (state, action) => {
      state.findListsStatus = defaultThunkSuccessState;
      const {data} = action.payload;
      listAdapter.upsertMany(state, data);
    });
    builder.addCase(getAllList.rejected, (state, action) => {
      state.findListsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(createList.pending, state => {
      state.findListsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(createList.fulfilled, (state, _action) => {
      state.findListsStatus = defaultThunkSuccessState;
      // listAdapter.addOne(state, action.payload);
      GAlert('List successfully creaetd', MessageType.SUCCESS);
    });
    builder.addCase(createList.rejected, (state, action) => {
      state.findListsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(updateList.pending, state => {
      state.updateListsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(updateList.fulfilled, (state, _action) => {
      state.updateListsStatus = defaultThunkSuccessState;
      GAlert('List successfully updated', MessageType.SUCCESS);
    });
    builder.addCase(updateList.rejected, (state, action) => {
      state.updateListsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(deleteList.pending, state => {
      state.updateListsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(deleteList.fulfilled, (state, action) => {
      state.updateListsStatus = defaultThunkSuccessState;
      listAdapter.removeOne(state, action.meta.arg);
    });
    builder.addCase(deleteList.rejected, (state, action) => {
      state.updateListsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(getDistributionConfig.pending, state => {
      state.fetchDistributionConfig = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(getDistributionConfig.fulfilled, (state, action) => {
      state.fetchDistributionConfig = defaultThunkSuccessState;
      if (Array.isArray(action.payload)) {
        state.distributionConfig = action.payload[0];
      } else {
        state.distributionConfig = action.payload;
      }
    });
    builder.addCase(getDistributionConfig.rejected, (state, action) => {
      state.fetchDistributionConfig = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(updateDistributionConfig.pending, state => {
      state.updateDistributionConfigStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(updateDistributionConfig.fulfilled, (state, action) => {
      state.updateDistributionConfigStatus = defaultThunkSuccessState;
    });
    builder.addCase(updateDistributionConfig.rejected, (state, action) => {
      state.updateDistributionConfigStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(getDistributionRules.pending, state => {
      state.updateDistributionConfigStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(getDistributionRules.fulfilled, (state, action) => {
      state.updateDistributionConfigStatus = defaultThunkSuccessState;
      state.distributionRules = action.payload;
    });
    builder.addCase(getDistributionRules.rejected, (state, action) => {
      state.updateDistributionConfigStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(deleteDistributionRule.pending, state => {
      state.updateDistributionConfigStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(deleteDistributionRule.fulfilled, (state, action) => {
      state.updateDistributionConfigStatus = defaultThunkSuccessState;
      state.distributionRules = state.distributionRules.filter(
        rule => rule._id !== action.meta.arg,
      );
    });
    builder.addCase(deleteDistributionRule.rejected, (state, action) => {
      state.updateDistributionConfigStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(updateDistributionRule.pending, state => {
      state.updateDistributionRuleStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(updateDistributionRule.fulfilled, (state, action) => {
      state.updateDistributionRuleStatus = defaultThunkSuccessState;
      // state.distributionRules = state.distributionRules.map(item => {
      //   let updatedItem = {...item};
      //   if (item._id === action.meta.arg._id) {
      //     updatedItem = {...updatedItem, ...action.meta.arg};
      //   }
      //   return updatedItem;
      // });
    });
    builder.addCase(updateDistributionRule.rejected, (state, action) => {
      state.updateDistributionRuleStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(createDistributionRule.pending, state => {
      state.updateDistributionRuleStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(createDistributionRule.fulfilled, (state, action) => {
      state.updateDistributionRuleStatus = defaultThunkSuccessState;
      state.distributionRules = [...state.distributionRules, action.payload];
    });
    builder.addCase(createDistributionRule.rejected, (state, action) => {
      state.updateDistributionRuleStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export const {restoreListStore} = listSlice.actions;
export default listSlice.reducer;

export const {
  selectAll: selectAllLists,
  selectById: selectListById,
  selectIds: selectListIds,
} = listAdapter.getSelectors<RootState>(state => state.list);

export const selectListNameById = createSelector(
  selectListById,
  (list: Nillable<List>) => (list && list?.name) || 'Leads',
);

export const selectDustributionRules = (state: RootState) => {
  return state.list.distributionRules;
};
export const selectDustributionConfig = (state: RootState) => {
  return state.list.distributionConfig;
};
