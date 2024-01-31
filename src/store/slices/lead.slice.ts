import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  BulkActionPayload,
  BulkSelectionMetadata,
  Lead,
} from 'datalib/entity/lead';
import {Note} from 'datalib/entity/note';
import {
  LeadFilterMetadata,
  PaginatedResult,
  PaginationQuery,
} from 'datalib/entity/paginatedResult';
import GAlert, {MessageType} from 'library/common/GAlert';
import {isNil} from 'lodash-es';
import LeadApi from '../../datalib/services/lead.api';
import {
  defaultThunkFailureState,
  defaultThunkLoadingState,
  defaultThunkSuccessState,
} from '../../models/common/thunk.config';
import {
  LeadListEnum,
  ThunkStatusEnum,
} from '../../models/common/thunkStatus.enum';
import {ThunkStatus} from '../../models/common/thunkStatus.interface';
import {Nillable} from '../../models/custom.types';
import Helper from '../../utils/helper';
import {RootState} from '../app.store';

const leadsAdapter = createEntityAdapter<Lead>({
  selectId: lead => lead._id || '',
});

const initialThunkState: ThunkStatus = {
  status: ThunkStatusEnum.IDLE,
  error: null,
};
export const initialLeadsParams: PaginationQuery = {
  page: 1,
  perPage: 50,
};
export const initialLeadFilterMetaData: LeadFilterMetadata = {
  sort: {
    orderBy: 'createdDate',
    isAscending: false,
  },
  paginationParams: {
    page: 1,
    perPage: 50,
  },
  isUntouched: false,
  isNotCalled: false,
  isFollowUp: false,
  isNotAssign: false,
};
const initialState: LeadState = leadsAdapter.getInitialState({
  leadPaginationMetadata: initialLeadsParams,
  leadFilterMetadata: initialLeadFilterMetaData,
  findLeadsStatus: initialThunkState,
  filterLeadsStatus: initialThunkState,
  uploadLeadStatus: initialThunkState,
  addLeadsStatus: initialThunkState,
  addNotesStatus: initialThunkState,
  fileUploadStatus: initialThunkState,
  updateLeadStatus: initialThunkState,
  getLeadNotesStatue: initialThunkState,
  leadListType: LeadListEnum.ALL_LEADS,
  totalLeads: 0,
  bulkSelectionLeadIds: [],
  bulkSelectionStatus: false,
  bulkSelectAll: false,
  displayCallLogs: false,
  autoDialerStatus: false,
  autoDialingMetaData: {
    countDownTimer: 30,
    currentIndex: 0,
    completedCalls: 0,
    dialerStatus: false,
    isCallAlive: false,
  },
});
interface LeadState extends EntityState<Lead> {
  leadPaginationMetadata: PaginationQuery;
  findLeadsStatus: ThunkStatus;
  addNotesStatus: ThunkStatus;
  filterLeadsStatus: ThunkStatus;
  addLeadsStatus: ThunkStatus;
  uploadLeadStatus: ThunkStatus;
  fileUploadStatus: ThunkStatus;
  updateLeadStatus: ThunkStatus;
  getLeadNotesStatue: ThunkStatus;
  leadFilterMetadata: LeadFilterMetadata;
  leadListType: LeadListEnum;
  totalLeads: number;
  bulkSelectionLeadIds: Array<string>;
  bulkSelectionStatus: boolean;
  bulkSelectAll: boolean;
  displayCallLogs: boolean;
  autoDialerStatus: boolean;
  autoDialingMetaData: {
    countDownTimer: number;
    currentIndex: number;
    completedCalls: number;
    dialerStatus: boolean;
    isCallAlive: boolean;
  };
}

export const getLeads = createAsyncThunk<
  PaginatedResult<Lead, number>,
  PaginationQuery | undefined,
  {rejectValue: string}
>(
  'leads/get-leads',
  async (paginatedQuey: PaginationQuery | undefined, {rejectWithValue}) => {
    try {
      return await new LeadApi().getAllLeads(
        paginatedQuey || initialLeadsParams,
      );
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getLeadNotes = createAsyncThunk<
  PaginatedResult<Note, number>,
  PaginationQuery | undefined,
  {rejectValue: string}
>(
  'leads/get-lead-notes',
  async (paginatedQuey: PaginationQuery | undefined, {rejectWithValue}) => {
    try {
      return await new LeadApi().getLeadNotes(
        paginatedQuey || initialLeadsParams,
      );
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);

export const getLeadsById = createAsyncThunk<
  Lead,
  string,
  {rejectValue: string}
>('leads/get-lead-by-id', async (leadId: string, {rejectWithValue}) => {
  try {
    return await new LeadApi().getLeadsById(leadId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const addNotes = createAsyncThunk<Note, Note, {rejectValue: string}>(
  'leads/add-note',
  async (note: Note, {rejectWithValue}) => {
    try {
      return await new LeadApi().addNotesData(note);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);

export const getFilterLeads = createAsyncThunk<
  PaginatedResult<Lead, number>,
  LeadFilterMetadata | undefined,
  {rejectValue: string}
>(
  'leads/get-filter-lead',
  async (filterParams: LeadFilterMetadata | undefined, {rejectWithValue}) => {
    try {
      return await new LeadApi().leadFilterData(
        filterParams || initialLeadFilterMetaData,
      );
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const addLeadsInformation = createAsyncThunk<
  Lead,
  Lead,
  {rejectValue: string}
>('/leads-create', async (leadData: Lead, {rejectWithValue}) => {
  try {
    return await new LeadApi().addLeadsData(leadData);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateLeadData = createAsyncThunk<
  boolean,
  Lead,
  {rejectValue: string}
>('/leads-update', async (leadData: Lead, {rejectWithValue}) => {
  try {
    return await new LeadApi().updateLeadsData(leadData);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const uploadCsvLeads = createAsyncThunk<
  boolean,
  object,
  {rejectValue: string}
>('/leads/upload-csv-lead', async (leadData: object, {rejectWithValue}) => {
  try {
    return await new LeadApi().uploadLeadCsv(leadData);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

export const deleteMultiLeads = createAsyncThunk<
  string,
  BulkActionPayload,
  {rejectValue: string}
>(
  '/lead-multi-delete',
  async (payload: BulkActionPayload, {rejectWithValue}) => {
    try {
      return await new LeadApi().deleteBulkLeads(payload);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const bulkAssignLeads = createAsyncThunk<
  string,
  BulkActionPayload,
  {rejectValue: string}
>(
  '/lead-multi-assign',
  async (payload: BulkActionPayload, {rejectWithValue}) => {
    try {
      return await new LeadApi().bulkAssignLeads(payload);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const copyLeadsInList = createAsyncThunk<
  string,
  BulkActionPayload,
  {rejectValue: string}
>('/lead-copy', async (payload: BulkActionPayload, {rejectWithValue}) => {
  try {
    return await new LeadApi().copyLeadsInList(payload);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const moveLeadsInList = createAsyncThunk<
  string,
  BulkActionPayload,
  {rejectValue: string}
>('/lead-move', async (payload: BulkActionPayload, {rejectWithValue}) => {
  try {
    return await new LeadApi().moveLeadsInList(payload);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateLeadStatus = createAsyncThunk<
  string,
  BulkActionPayload,
  {rejectValue: string}
>(
  '/lead-update-status',
  async (payload: BulkActionPayload, {rejectWithValue}) => {
    try {
      return await new LeadApi().updateLeadsStatus(payload);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const updateLeadLabels = createAsyncThunk<
  string,
  BulkActionPayload,
  {rejectValue: string}
>(
  '/lead-update-labels',
  async (payload: BulkActionPayload, {rejectWithValue}) => {
    try {
      return await new LeadApi().updateLeadsLabels(payload);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const uploadFile = createAsyncThunk<
  boolean,
  FormData,
  {rejectValue: string}
>('/lead-uplaod-fle', async (payload: FormData, {rejectWithValue}) => {
  try {
    return await new LeadApi().uploadFile(payload);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const deleteFiles = createAsyncThunk<
  boolean,
  any,
  {rejectValue: string}
>('/lead-delete-files', async (payload: any, {rejectWithValue}) => {
  try {
    return await new LeadApi().deleteFiles(payload);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    restoreLeadStore: () => initialState,
    resetBulkSelection: state => {
      state.bulkSelectionLeadIds = [];
      state.bulkSelectionStatus = false;
      state.bulkSelectAll = false;
    },
    toggleBulkSelectionStatus: (state, action: PayloadAction<boolean>) => {
      state.bulkSelectionStatus = action.payload;
    },
    bulkSelectAll: (state, action: PayloadAction<boolean>) => {
      state.bulkSelectAll = action.payload;
    },
    setAutoDialerDuration: (state, action: PayloadAction<number>) => {
      const autoDialerMetadata = {...state.autoDialingMetaData};
      autoDialerMetadata.countDownTimer = action.payload;
      state.autoDialingMetaData = autoDialerMetadata;
    },
    setAutoDialerStatus: (state, action: PayloadAction<boolean>) => {
      const autoDialerMetadata = {...state.autoDialingMetaData};
      autoDialerMetadata.dialerStatus = action.payload;
      state.autoDialingMetaData = autoDialerMetadata;
    },
    setDialerIndex: (state, action: PayloadAction<number>) => {
      const autoDialerMetadata = {...state.autoDialingMetaData};
      autoDialerMetadata.currentIndex = action.payload;
      state.autoDialingMetaData = autoDialerMetadata;
    },
    setCallStatus: (state, action: PayloadAction<boolean>) => {
      const autoDialerMetadata = {...state.autoDialingMetaData};
      autoDialerMetadata.isCallAlive = action.payload;
      state.autoDialingMetaData = autoDialerMetadata;
    },
    showAutoDialer: (state, action: PayloadAction<boolean>) => {
      state.autoDialerStatus = action.payload;
    },
    addToBulkSelection: (
      state,
      action: PayloadAction<Array<string> | string>,
    ) => {
      if (Array.isArray(action.payload)) {
        state.bulkSelectionLeadIds = [
          ...state.bulkSelectionLeadIds,
          ...action.payload,
        ];
      } else {
        state.bulkSelectionLeadIds.push(action.payload);
      }

      if (!state.bulkSelectionStatus) {
        state.bulkSelectionStatus = true;
      }
    },
    removeFromBulkSelection: (state, action: PayloadAction<string>) => {
      const newBulkArr = [...state.bulkSelectionLeadIds];
      const index = newBulkArr.indexOf(action.payload);
      if (index !== -1) {
        newBulkArr.splice(index, 1);
      }
      if (newBulkArr.length === 0) {
        state.bulkSelectionStatus = false;
        state.bulkSelectAll = false;
      }
      state.bulkSelectionLeadIds = newBulkArr;
    },
    setCallLogs: (state, action: PayloadAction<boolean>) => {
      state.displayCallLogs = action.payload;
      if (action.payload) {
        const filter = {...state.leadFilterMetadata};
        delete filter.list;
        state.leadFilterMetadata = filter;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(getLeads.pending, state => {
      state.findLeadsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(getLeads.fulfilled, (state, action) => {
      state.findLeadsStatus = defaultThunkSuccessState;
      const {data, page, total} = action.payload;
      const filterMetaData = {...initialLeadFilterMetaData};

      if (action.meta.arg?.list) {
        filterMetaData.list = action.meta.arg?.list;
      }
      state.leadFilterMetadata = filterMetaData;
      state.leadPaginationMetadata.page = page;
      state.totalLeads = total;
      state.leadListType = LeadListEnum.ALL_LEADS;
      if (page === 1) {
        data && leadsAdapter.setAll(state, data);
      } else {
        data && leadsAdapter.upsertMany(state, data);
      }
    });
    builder.addCase(getLeads.rejected, (state, action) => {
      state.findLeadsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    // filter leads response Data

    builder.addCase(getFilterLeads.pending, state => {
      state.filterLeadsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(getFilterLeads.fulfilled, (state, action) => {
      state.filterLeadsStatus = defaultThunkSuccessState;
      const {data, page, total} = action.payload;
      if (action.meta.arg) {
        state.leadFilterMetadata = action.meta.arg;
      }

      state.totalLeads = total;
      state.leadPaginationMetadata.page = page;
      state.leadListType = LeadListEnum.FILTERED_LEADS;
      if (page === 1) {
        data && leadsAdapter.setAll(state, data);
      } else {
        data && leadsAdapter.upsertMany(state, data);
      }
    });
    builder.addCase(getFilterLeads.rejected, (state, action) => {
      state.filterLeadsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(getLeadsById.pending, state => {
      state.findLeadsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading leads...',
      };
    });
    builder.addCase(getLeadsById.fulfilled, (state, action) => {
      state.findLeadsStatus = defaultThunkSuccessState;
      if (action.payload._id) {
        state.entities[action.payload._id] = {
          ...state.entities[action.payload._id],
          ...action.payload,
        };
      }
    });
    builder.addCase(getLeadsById.rejected, (state, action) => {
      state.findLeadsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    // add Notes Information

    builder.addCase(addNotes.pending, state => {
      state.addNotesStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(addNotes.fulfilled, (state, _action) => {
      state.addNotesStatus = defaultThunkSuccessState;
    });
    builder.addCase(addNotes.rejected, (state, action) => {
      state.addNotesStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    // add leads response Data

    builder.addCase(addLeadsInformation.pending, state => {
      state.addLeadsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(addLeadsInformation.fulfilled, (state, action) => {
      state.addLeadsStatus = defaultThunkSuccessState;
      leadsAdapter.upsertOne(state, action.payload);
    });
    builder.addCase(addLeadsInformation.rejected, (state, action) => {
      state.addLeadsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    // add list response Data
    builder.addCase(uploadCsvLeads.pending, state => {
      state.uploadLeadStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(uploadCsvLeads.fulfilled, (state, action) => {
      state.uploadLeadStatus = defaultThunkSuccessState;
    });
    builder.addCase(uploadCsvLeads.rejected, (state, action) => {
      state.uploadLeadStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    // add list response Data
    builder.addCase(uploadFile.pending, state => {
      state.fileUploadStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(uploadFile.fulfilled, (state, _action) => {
      state.fileUploadStatus = defaultThunkSuccessState;
    });
    builder.addCase(uploadFile.rejected, (state, action) => {
      state.fileUploadStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(copyLeadsInList.pending, state => {
      state.updateLeadStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(copyLeadsInList.fulfilled, (state, _action) => {
      state.updateLeadStatus = defaultThunkSuccessState;
      GAlert('Lead copied successfully', MessageType.SUCCESS);
    });
    builder.addCase(copyLeadsInList.rejected, (state, action) => {
      state.updateLeadStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(updateLeadStatus.pending, state => {
      state.updateLeadStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(updateLeadStatus.fulfilled, (state, _action) => {
      state.updateLeadStatus = defaultThunkSuccessState;
      if (_action.meta.arg.status) {
        _action.meta.arg.leadIDs?.map(_item => {
          state.entities[_item] = {
            ...state.entities[_item],
            status: _action.meta.arg.status ? [_action.meta.arg.status] : [],
          };
        });
      }

      GAlert('Status updated successfully', MessageType.SUCCESS);
    });
    builder.addCase(updateLeadStatus.rejected, (state, action) => {
      state.updateLeadStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(updateLeadLabels.pending, state => {
      state.updateLeadStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(updateLeadLabels.fulfilled, (state, _action) => {
      state.updateLeadStatus = defaultThunkSuccessState;

      _action.meta.arg.leadIDs?.map(_item => {
        state.entities[_item] = {
          ...state.entities[_item],
          label: _action.meta.arg.label,
        };
      });
      GAlert('Label updated successfully', MessageType.SUCCESS);
    });
    builder.addCase(updateLeadLabels.rejected, (state, action) => {
      state.updateLeadStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(moveLeadsInList.pending, state => {
      state.updateLeadStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(moveLeadsInList.fulfilled, (state, _action) => {
      state.updateLeadStatus = defaultThunkSuccessState;
      if (_action.meta.arg.leadIDs && _action.meta.arg.leadIDs.length) {
        GAlert(
          `${
            _action.meta.arg.leadIDs.length > 1 ? 'Leads' : 'Lead'
          } moved successfully`,
          MessageType.SUCCESS,
        );
        state.totalLeads =
          state.totalLeads - (_action.meta.arg.leadIDs.length || 0);
      }

      leadsAdapter.removeMany(state, _action.meta.arg.leadIDs || []);
    });
    builder.addCase(moveLeadsInList.rejected, (state, action) => {
      state.updateLeadStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(deleteMultiLeads.pending, state => {
      state.updateLeadStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(deleteMultiLeads.fulfilled, (state, _action) => {
      state.updateLeadStatus = defaultThunkSuccessState;

      if (_action.meta.arg.leadIDs && _action.meta.arg.leadIDs.length) {
        GAlert(
          `${
            _action.meta.arg.leadIDs.length > 1 ? 'Leads' : 'Lead'
          } deleted successfully`,
          MessageType.SUCCESS,
        );
        state.totalLeads =
          state.totalLeads - (_action.meta.arg.leadIDs.length || 0);
      }

      leadsAdapter.removeMany(state, _action.meta.arg.leadIDs || []);
    });
    builder.addCase(deleteMultiLeads.rejected, (state, action) => {
      state.updateLeadStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(bulkAssignLeads.pending, state => {
      state.updateLeadStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(bulkAssignLeads.fulfilled, (state, _action) => {
      state.updateLeadStatus = defaultThunkSuccessState;
      GAlert('Successfully Assigned', MessageType.SUCCESS);
    });
    builder.addCase(bulkAssignLeads.rejected, (state, action) => {
      state.updateLeadStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(deleteFiles.pending, state => {
      state.updateLeadStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(deleteFiles.fulfilled, (state, _action) => {
      state.updateLeadStatus = defaultThunkSuccessState;
      GAlert('Successfully deleted', MessageType.SUCCESS);
    });
    builder.addCase(deleteFiles.rejected, (state, action) => {
      state.updateLeadStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getLeadNotes.pending, state => {
      state.getLeadNotesStatue = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(getLeadNotes.fulfilled, (state, _action) => {
      state.getLeadNotesStatue = defaultThunkSuccessState;
      if (_action.meta.arg && _action.meta.arg?.leadId) {
        state.entities[_action.meta.arg.leadId] = {
          ...state.entities[_action.meta.arg?.leadId],
          notesArr: _action.payload.data,
        };
      }
    });
    builder.addCase(getLeadNotes.rejected, (state, action) => {
      state.getLeadNotesStatue = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export const {
  restoreLeadStore,
  resetBulkSelection,
  addToBulkSelection,
  removeFromBulkSelection,
  toggleBulkSelectionStatus,
  bulkSelectAll,
  setCallLogs,
  setAutoDialerDuration,
  setAutoDialerStatus,
  showAutoDialer,
  setCallStatus,
  setDialerIndex,
} = leadSlice.actions;
export default leadSlice.reducer;

export const {
  selectAll: selectAllLeads,
  selectById: selectLeadById,
  selectIds: selectLeadIds,
} = leadsAdapter.getSelectors<RootState>(state => state.lead);

export const leadIdsSelector = createSelector(
  [selectLeadIds],
  leadIds => leadIds,
);
export const getSectionLeads = createSelector([selectAllLeads], leads =>
  Helper.formatDataDateWise(leads),
);
export const leadByIdSelector = createSelector(
  selectLeadById,
  (lead: Nillable<Lead>) => {
    if (!isNil(lead)) {
      return lead;
    } else {
      return null;
    }
  },
);
// export const getSectionLeads: (state: RootState) => Array<any> = (
//   state: RootState,
// ) => state.lead.sectionLeadIds || [];

export const selectFilterMetaData: (state: RootState) => LeadFilterMetadata = (
  state: RootState,
) => state.lead.leadFilterMetadata || initialLeadFilterMetaData;

export const getLeadActivities = createSelector(
  selectLeadById,
  (lead: Nillable<Lead>) => {
    if (lead?.activities) {
      const activities = [...lead.activities];
      return activities.sort(
        (a: any, b: any) =>
          new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime(),
      );
    } else {
      return [];
    }
  },
);
export const selectLeadNotes = createSelector(
  selectLeadById,
  (lead: Nillable<Lead>) => {
    if (lead?.notesArr) {
      const notes = [...lead.notesArr];
      return notes.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      return [];
    }
  },
);
export const getLeadTasks = createSelector(
  selectLeadById,
  (lead: Nillable<Lead>) => {
    if (lead?.tasks) {
      const tasks = [...lead.tasks];
      return tasks.sort(
        (a: any, b: any) =>
          new Date(b.toBePerformAt).getTime() -
          new Date(a.toBePerformAt).getTime(),
      );
    } else {
      return [];
    }
  },
);
export const selectBulkMetadata: (state: RootState) => BulkSelectionMetadata = (
  state: RootState,
) => ({
  leadIds: state.lead.bulkSelectionLeadIds,
  bulkSelectionStatus: state.lead.bulkSelectionStatus,
  selectAllStatus: state.lead.bulkSelectAll,
});
