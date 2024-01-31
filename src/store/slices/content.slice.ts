import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import {Content, SharePayload} from 'datalib/entity/content';
import {
  PaginatedResult,
  PaginationMetadata,
} from 'datalib/entity/paginatedResult';
import ContentApi from 'datalib/services/content.api';
import {ContentTypeEnum} from '../../models/common/content.enum';
import {
  defaultThunkFailureState,
  defaultThunkLoadingState,
  defaultThunkSuccessState,
} from '../../models/common/thunk.config';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {ThunkStatus} from '../../models/common/thunkStatus.interface';
import {Nillable} from '../../models/custom.types';
import {RootState} from '../app.store';

const contentsAdapter = createEntityAdapter<Content>({
  selectId: content => content._id || '',
});

const initialThunkState: ThunkStatus = {
  status: ThunkStatusEnum.IDLE,
  error: null,
};
const initialPaginationFilesData: PaginationMetadata<number> = {
  orderBy: 'createdAt',
  isAscending: true,
  page: 1,
  perPage: 100,
  type: ContentTypeEnum.FILE,
};
const initialPaginationPagesData: PaginationMetadata<number> = {
  orderBy: 'createdAt',
  isAscending: true,
  page: 1,
  perPage: 100,
  type: ContentTypeEnum.PAGE,
};
const initialPaginationMessagesData: PaginationMetadata<number> = {
  orderBy: 'createdAt',
  isAscending: true,
  page: 1,
  perPage: 100,
  type: ContentTypeEnum.MESSAGE,
};
const initialState: ContentState = contentsAdapter.getInitialState({
  total: {
    message: 0,
    file: 0,
    page: 0,
  },
  contentPaginationMetadata: {
    message: initialPaginationMessagesData,
    file: initialPaginationFilesData,
    page: initialPaginationPagesData,
  },
  fetchContentStatus: initialThunkState,
  updateContentStatus: initialThunkState,
  shareContentStatus: initialThunkState,
});
interface ContentState extends EntityState<Content> {
  total: {
    message: number;
    file: number;
    page: number;
  };
  fetchContentStatus: ThunkStatus;
  updateContentStatus: ThunkStatus;
  shareContentStatus: ThunkStatus;
  contentPaginationMetadata: {
    message: PaginationMetadata<number>;
    file: PaginationMetadata<number>;
    page: PaginationMetadata<number>;
  };
}

export const getAllContents = createAsyncThunk<
  PaginatedResult<Content, number>,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'Contents/get-contents',
  async (paginatedQuey: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new ContentApi().getAllContent(paginatedQuey);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const createContent = createAsyncThunk<
  Content,
  Content,
  {rejectValue: string}
>('Contents/create-content', async (conetnt: Content, {rejectWithValue}) => {
  try {
    return await new ContentApi().createContent(conetnt);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const shareContent = createAsyncThunk<
  any,
  SharePayload,
  {rejectValue: string}
>(
  'Contents/share-content',
  async (conetnt: SharePayload, {rejectWithValue}) => {
    try {
      return await new ContentApi().shareContent(conetnt);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getContentById = createAsyncThunk<
  Content,
  string,
  {rejectValue: string}
>('Contents/get-content', async (conetntId: string, {rejectWithValue}) => {
  try {
    return await new ContentApi().getSingleContent(conetntId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateContent = createAsyncThunk<
  boolean,
  Content,
  {rejectValue: string}
>('Contents/update-content', async (conetnt: Content, {rejectWithValue}) => {
  try {
    return await new ContentApi().updateContent(conetnt);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const deleteContent = createAsyncThunk<
  boolean,
  string,
  {rejectValue: string}
>('Contents/delete-content', async (conetntId: string, {rejectWithValue}) => {
  try {
    return await new ContentApi().deleteContentById(conetntId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

const contentSlice = createSlice({
  name: 'contents',
  initialState,
  reducers: {
    restoreContentStore: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(getAllContents.pending, state => {
      state.fetchContentStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(getAllContents.fulfilled, (state, action) => {
      state.fetchContentStatus = defaultThunkSuccessState;
      const {data, page, total} = action.payload;
      const type: Nillable<ContentTypeEnum> = action.meta.arg.type;
      if (type) {
        state.total[type] = total;
        state.contentPaginationMetadata[type].page = page;
      } else {
        data.map((item: Content) => {
          if (item.type) {
            state.total[item.type] = state.total[item.type] + 1;
          }
        });
      }

      contentsAdapter.upsertMany(state, data);
    });
    builder.addCase(getAllContents.rejected, (state, action) => {
      state.fetchContentStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(createContent.pending, state => {
      state.updateContentStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(createContent.fulfilled, (state, action) => {
      state.updateContentStatus = defaultThunkSuccessState;

      if (action.payload) {
        contentsAdapter.upsertOne(state, action.payload);
      }
    });
    builder.addCase(createContent.rejected, (state, action) => {
      state.updateContentStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(updateContent.pending, state => {
      state.updateContentStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(updateContent.fulfilled, (state, action) => {
      state.updateContentStatus = defaultThunkSuccessState;
      // state[action.args.meta._id] = action.args.meta;
    });
    builder.addCase(updateContent.rejected, (state, action) => {
      state.updateContentStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(deleteContent.pending, state => {
      state.updateContentStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(deleteContent.fulfilled, (state, action) => {
      state.updateContentStatus = defaultThunkSuccessState;
      contentsAdapter.removeOne(state, action.meta.arg);
    });
    builder.addCase(deleteContent.rejected, (state, action) => {
      state.updateContentStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getContentById.pending, state => {
      state.updateContentStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(getContentById.fulfilled, (state, action) => {
      state.updateContentStatus = defaultThunkSuccessState;
      contentsAdapter.upsertOne(state, action.payload);
    });
    builder.addCase(getContentById.rejected, (state, action) => {
      state.updateContentStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(shareContent.pending, state => {
      state.shareContentStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'Loading',
      };
    });
    builder.addCase(shareContent.fulfilled, (state, _action) => {
      state.shareContentStatus = defaultThunkSuccessState;
    });
    builder.addCase(shareContent.rejected, (state, action) => {
      state.shareContentStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export const {restoreContentStore} = contentSlice.actions;
export default contentSlice.reducer;

export const {
  selectAll: selectAllContent,
  selectById: selectContentById,
  selectIds: selectContentIds,
} = contentsAdapter.getSelectors<RootState>(state => state.content);

export const selectAllContentByType = createSelector(
  [selectAllContent, (state: RootState, type: ContentTypeEnum) => type],
  (contents: Array<Content>, type: ContentTypeEnum) =>
    contents
      .filter(_c => _c.type === type)
      .sort(
        (a, b) =>
          new Date(b?.createdAt || '').getTime() -
          new Date(a?.createdAt || '').getTime(),
      ),
);
