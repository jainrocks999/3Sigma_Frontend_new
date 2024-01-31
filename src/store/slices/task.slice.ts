import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

import {
  PaginatedResult,
  PaginationMetadata,
} from 'datalib/entity/paginatedResult';
import {Task} from 'datalib/entity/task';
import TaskApi from 'datalib/services/task.api';
import moment from 'moment';
import {TaskTypeEnum} from '../../models/common/task.type.enum';

import {
  defaultThunkFailureState,
  defaultThunkLoadingState,
  defaultThunkSuccessState,
} from '../../models/common/thunk.config';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {ThunkStatus} from '../../models/common/thunkStatus.interface';
import {RootState} from '../app.store';
const PAGE_SIZE = 20;
const tasksAdapter = createEntityAdapter<Task>({
  selectId: lead => lead._id || '',
});

const initialThunkState: ThunkStatus = {
  status: ThunkStatusEnum.IDLE,
  error: null,
};

const initialPaginationCompletedData: PaginationMetadata<number> = {
  page: 1,
  perPage: PAGE_SIZE,
  status: TaskTypeEnum.COMPLETED,
};
const initialPaginationOverdueData: PaginationMetadata<number> = {
  page: 1,
  perPage: PAGE_SIZE,
  status: TaskTypeEnum.OVERDUE,
};
const initialPaginationTodayData: PaginationMetadata<number> = {
  page: 1,
  perPage: PAGE_SIZE,
  status: TaskTypeEnum.TODAY,
};
const initialPaginationUpcomingData: PaginationMetadata<number> = {
  page: 1,
  perPage: PAGE_SIZE,
  status: TaskTypeEnum.UPCOMING,
};
export const initialFilterMetadata: PaginationMetadata<number> = {
  orderBy: 'toBePerformAt',
  isAscending: true,
};

const initialState: TaskState = tasksAdapter.getInitialState({
  taskPaginationMetadata: {
    [TaskTypeEnum.COMPLETED]: initialPaginationCompletedData,
    [TaskTypeEnum.OVERDUE]: initialPaginationOverdueData,
    [TaskTypeEnum.TODAY]: initialPaginationTodayData,
    [TaskTypeEnum.UPCOMING]: initialPaginationUpcomingData,
  },
  filterMetadata: initialFilterMetadata,
  totalTasks: {
    [TaskTypeEnum.COMPLETED]: 0,
    [TaskTypeEnum.OVERDUE]: 0,
    [TaskTypeEnum.TODAY]: 0,
    [TaskTypeEnum.UPCOMING]: 0,
  },
  findTasksStatus: initialThunkState,
  updateTasksStatus: initialThunkState,
  loadedTabs: [],
  activeTab: TaskTypeEnum.TODAY,
});
interface TaskState extends EntityState<Task> {
  taskPaginationMetadata: {
    [TaskTypeEnum.COMPLETED]: PaginationMetadata<number>;
    [TaskTypeEnum.OVERDUE]: PaginationMetadata<number>;
    [TaskTypeEnum.TODAY]: PaginationMetadata<number>;
    [TaskTypeEnum.UPCOMING]: PaginationMetadata<number>;
  };
  filterMetadata: PaginationMetadata<number>;
  totalTasks: {
    [TaskTypeEnum.COMPLETED]: number;
    [TaskTypeEnum.OVERDUE]: number;
    [TaskTypeEnum.TODAY]: number;
    [TaskTypeEnum.UPCOMING]: number;
  };
  findTasksStatus: ThunkStatus;
  updateTasksStatus: ThunkStatus;
  loadedTabs: Array<TaskTypeEnum>;
  activeTab: TaskTypeEnum;
}

export const getAllTask = createAsyncThunk<
  PaginatedResult<Task, number>,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  '/task-get-all',
  async (task: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new TaskApi().getAlltask(task);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const createTask = createAsyncThunk<Task, Task, {rejectValue: string}>(
  '/task-create',
  async (task: Task, {rejectWithValue}) => {
    try {
      return await new TaskApi().createTask(task);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getTaskById = createAsyncThunk<
  Task,
  string,
  {rejectValue: string}
>('/task-get-by-id', async (taskId: string, {rejectWithValue}) => {
  try {
    return await new TaskApi().getTaskById(taskId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateTaskCount = createAsyncThunk<
  TaskTypeEnum,
  TaskTypeEnum,
  {rejectValue: string}
>('/task-get-by-id', async (type: TaskTypeEnum, {rejectWithValue}) => {
  try {
    return type;
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateTask = createAsyncThunk<
  boolean,
  Task,
  {rejectValue: string}
>('/task-update', async (task: Task, {rejectWithValue}) => {
  try {
    return await new TaskApi().updateTask(task);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const deleteTask = createAsyncThunk<
  boolean,
  string,
  {rejectValue: string}
>('/task-delete', async (taskId: string, {rejectWithValue}) => {
  try {
    return await new TaskApi().deleteTask(taskId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    restoreTaskStore: () => initialState,
  },
  extraReducers: builder => {
    // add task response Data
    builder.addCase(getAllTask.pending, state => {
      state.findTasksStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(getAllTask.fulfilled, (state, action) => {
      state.findTasksStatus = defaultThunkSuccessState;
      const {data, page} = action.payload;
      if (action.payload.aggregation) {
        state.totalTasks = action.payload.aggregation;
      } else {
        state.totalTasks = {
          [TaskTypeEnum.COMPLETED]: 0,
          [TaskTypeEnum.OVERDUE]: 0,
          [TaskTypeEnum.TODAY]: 0,
          [TaskTypeEnum.UPCOMING]: 0,
        };
      }
      if (action.meta.arg.status) {
        const taskType: TaskTypeEnum = action.meta.arg.status;
        state.activeTab = taskType;
        state.taskPaginationMetadata[taskType].page = page || 1;
        const filters = {...action.meta.arg};
        delete filters.page;
        delete filters.perPage;
        delete filters.status;
        state.filterMetadata = filters;
        if (!state.loadedTabs.includes(taskType)) {
          state.loadedTabs.push(taskType);
        }
      }
      tasksAdapter.upsertMany(state, data);
    });
    builder.addCase(getAllTask.rejected, (state, action) => {
      state.findTasksStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(createTask.pending, state => {
      state.updateTasksStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(createTask.fulfilled, (state, _action) => {
      state.updateTasksStatus = defaultThunkSuccessState;
      console.log('createTask', _action.payload);
      tasksAdapter.upsertOne(state, _action.payload);
      state.loadedTabs = [];
    });
    builder.addCase(createTask.rejected, (state, action) => {
      state.updateTasksStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getTaskById.pending, state => {
      state.updateTasksStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(getTaskById.fulfilled, (state, action) => {
      state.updateTasksStatus = defaultThunkSuccessState;
      tasksAdapter.upsertOne(state, action.payload);
    });
    builder.addCase(getTaskById.rejected, (state, action) => {
      state.updateTasksStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(updateTask.pending, state => {
      state.updateTasksStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(updateTask.fulfilled, (state, _action) => {
      state.updateTasksStatus = defaultThunkSuccessState;
      // tasksAdapter.updateOne(state, action.payload);
      state.loadedTabs = [];
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.updateTasksStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(deleteTask.pending, state => {
      state.updateTasksStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading',
      };
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.updateTasksStatus = defaultThunkSuccessState;
      tasksAdapter.removeOne(state, action.meta.arg);
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.updateTasksStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export const {restoreTaskStore} = taskSlice.actions;
export default taskSlice.reducer;

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds,
} = tasksAdapter.getSelectors<RootState>(state => state.task);

export const selectTaskByType = createSelector(
  [selectAllTasks, (state: RootState, taskType: TaskTypeEnum) => taskType],
  (tasks: Array<Task>, taskType: TaskTypeEnum) =>
    tasks.filter(_c => {
      const daysDiff = moment
        .duration(
          moment().startOf('day').diff(moment(_c.toBePerformAt).startOf('day')),
        )
        .asDays();
      if (taskType === TaskTypeEnum.COMPLETED) {
        return _c.isCompleted;
      } else if (taskType === TaskTypeEnum.OVERDUE) {
        return (daysDiff > 1 || daysDiff === 1) && !_c.isCompleted
          ? true
          : false;
      } else if (taskType === TaskTypeEnum.TODAY) {
        return daysDiff < 1 && daysDiff >= 0 && !_c.isCompleted ? true : false;
      } else if (taskType === TaskTypeEnum.UPCOMING) {
        return daysDiff < 0 && !_c.isCompleted ? true : false;
      } else {
        return true;
      }
    }),
);

export const selectTaskByLead = createSelector(
  [selectAllTasks, (state: RootState, leadId: string) => leadId],
  (tasks: Array<Task>, leadId: string) =>
    tasks.filter(_c => _c.lead && _c.lead[0]._id === leadId),
);
