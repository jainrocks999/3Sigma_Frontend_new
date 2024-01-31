/* eslint-disable no-param-reassign */
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
import {Quotation} from 'datalib/entity/quotation';
import {Category} from 'datalib/entity/category';
import QuotationApi from 'datalib/services/product.api';
import {isNil} from 'lodash-es';
import {
  defaultThunkFailureState,
  defaultThunkLoadingState,
  defaultThunkSuccessState,
} from '../../models/common/thunk.config';
import {ThunkStatusEnum} from '../../models/common/thunkStatus.enum';
import {ThunkStatus} from '../../models/common/thunkStatus.interface';
import {RootState} from '../app.store';
import {Nillable} from '../../models/custom.types';
import {Product} from 'datalib/entity/product';
import Helper from '../../utils/helper';
import GAlert, {MessageType} from 'library/common/GAlert';

const quotationAdapter = createEntityAdapter<Quotation>({
  selectId: product => product._id || '',
});

const initialThunkState: ThunkStatus = {
  status: ThunkStatusEnum.IDLE,
  error: null,
};

export const initialPaginationMetaData: PaginationMetadata<number> = {
  orderBy: '_id',
  isAscending: false,
  page: 1,
  perPage: 200,
};

interface QuotationState extends EntityState<Quotation> {
  paginationMetadata: PaginationMetadata<number>;
  findQuotationsStatus: ThunkStatus;
  updateQuotationsStatus: ThunkStatus;
  findCategoriesStatus: ThunkStatus;
  updateCategoriesStatus: ThunkStatus;
  findProductsStatus: ThunkStatus;
  updateProductsStatus: ThunkStatus;
  categories: Array<Category>;
  products: Array<Product>;
  total: Number;
}

const initialState: QuotationState = quotationAdapter.getInitialState({
  paginationMetadata: initialPaginationMetaData,
  findQuotationsStatus: initialThunkState,
  updateQuotationsStatus: initialThunkState,
  findCategoriesStatus: initialThunkState,
  updateCategoriesStatus: initialThunkState,
  findProductsStatus: initialThunkState,
  updateProductsStatus: initialThunkState,
  categories: [],
  products: [],
  total: 0,
});

export const getQuotations = createAsyncThunk<
  PaginatedResult<Quotation, number>,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'quotation/get-quotation',
  async (params: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new QuotationApi().getAllQuotation(params);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const createQuotation = createAsyncThunk<
  Quotation,
  Quotation,
  {rejectValue: string}
>(
  'quotation/create-quotation',
  async (conetnt: Quotation, {rejectWithValue}) => {
    try {
      return await new QuotationApi().createQuotation(conetnt);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const getQuotationById = createAsyncThunk<
  Quotation,
  string,
  {rejectValue: string}
>(
  'quotation/get-quotation-id',
  async (conetntId: string, {rejectWithValue}) => {
    try {
      return await new QuotationApi().getSingleQuotation(conetntId);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const updateQuotation = createAsyncThunk<
  boolean,
  Quotation,
  {rejectValue: string}
>(
  'quotation/update-quotation',
  async (payload: Quotation, {rejectWithValue}) => {
    try {
      return await new QuotationApi().updateQuotation(payload);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const deleteQuotation = createAsyncThunk<
  boolean,
  string,
  {rejectValue: string}
>(
  'quotation/delete-quotation',
  async (quotationId: string, {rejectWithValue}) => {
    try {
      return await new QuotationApi().deleteQuotationById(quotationId);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);

export const getProducts = createAsyncThunk<
  PaginatedResult<Product, number>,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'quotation/get-product',
  async (params: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new QuotationApi().getAllProduct(params);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const createProduct = createAsyncThunk<
  Product,
  Product,
  {rejectValue: string}
>('quotation/create-product', async (conetnt: Product, {rejectWithValue}) => {
  try {
    return await new QuotationApi().createProduct(conetnt);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const getProductById = createAsyncThunk<
  Product,
  string,
  {rejectValue: string}
>('quotation/get-product-id', async (conetntId: string, {rejectWithValue}) => {
  try {
    return await new QuotationApi().getSingleProduct(conetntId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateProduct = createAsyncThunk<
  boolean,
  Product,
  {rejectValue: string}
>('quotation/update-product', async (conetnt: Product, {rejectWithValue}) => {
  try {
    return await new QuotationApi().updateProduct(conetnt);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const deleteProduct = createAsyncThunk<
  boolean,
  string,
  {rejectValue: string}
>('quotation/delete-product', async (conetntId: string, {rejectWithValue}) => {
  try {
    return await new QuotationApi().deleteProductById(conetntId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

export const getCategories = createAsyncThunk<
  PaginatedResult<Category, number>,
  PaginationMetadata<number>,
  {rejectValue: string}
>(
  'quotation/get-category',
  async (params: PaginationMetadata<number>, {rejectWithValue}) => {
    try {
      return await new QuotationApi().getAllCategories(params);
    } catch (error: any) {
      return rejectWithValue(error.code);
    }
  },
);
export const createCategory = createAsyncThunk<
  Category,
  Category,
  {rejectValue: string}
>('quotation/create-Category', async (conetnt: Category, {rejectWithValue}) => {
  try {
    return await new QuotationApi().createCategory(conetnt);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const getCategoryById = createAsyncThunk<
  Category,
  string,
  {rejectValue: string}
>('quotation/get-Category-id', async (conetntId: string, {rejectWithValue}) => {
  try {
    return await new QuotationApi().getSingleCategory(conetntId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const updateCategory = createAsyncThunk<
  boolean,
  Category,
  {rejectValue: string}
>('quotation/update-Category', async (conetnt: Category, {rejectWithValue}) => {
  try {
    return await new QuotationApi().updateCategory(conetnt);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const deleteCategory = createAsyncThunk<
  boolean,
  string,
  {rejectValue: string}
>('quotation/delete-Category', async (conetntId: string, {rejectWithValue}) => {
  try {
    return await new QuotationApi().deleteCategoryById(conetntId);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
// TODO: Remove boilerplate?
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    restoreQuotationStore: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(getQuotations.pending, state => {
      state.findQuotationsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(getQuotations.fulfilled, (state, action) => {
      state.findQuotationsStatus = defaultThunkSuccessState;
      const {total, data, page} = action.payload;
      const paginationMetadata = {page};
      state.paginationMetadata = {
        ...state.paginationMetadata,
        ...paginationMetadata,
      };
      if (page === 1) {
        quotationAdapter.removeAll(state);
      }
      state.total = total;
      data && quotationAdapter.upsertMany(state, data);
    });
    builder.addCase(getQuotations.rejected, (state, action) => {
      state.findQuotationsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //createQuotation
    builder.addCase(createQuotation.pending, state => {
      state.updateQuotationsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(createQuotation.fulfilled, (state, _action) => {
      state.updateQuotationsStatus = defaultThunkSuccessState;
      GAlert('Quotation created successfully', MessageType.SUCCESS);
      if (Array.isArray(_action.payload)) {
        quotationAdapter.upsertOne(state, _action.payload[0]);
      }
    });
    builder.addCase(createQuotation.rejected, (state, action) => {
      state.updateQuotationsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //updateQuotation
    builder.addCase(updateQuotation.pending, state => {
      state.updateQuotationsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(updateQuotation.fulfilled, (state, _action) => {
      state.updateQuotationsStatus = defaultThunkSuccessState;
      GAlert('Quotation updated successfully', MessageType.SUCCESS);
    });
    builder.addCase(updateQuotation.rejected, (state, action) => {
      state.updateQuotationsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //deleteQuotation
    builder.addCase(deleteQuotation.pending, state => {
      state.updateQuotationsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(deleteQuotation.fulfilled, (state, action) => {
      state.updateQuotationsStatus = defaultThunkSuccessState;
      GAlert('Quotation deleted successfully', MessageType.SUCCESS);
      quotationAdapter.removeOne(state, action.meta.arg);
    });
    builder.addCase(deleteQuotation.rejected, (state, action) => {
      state.updateQuotationsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //getQuotationById
    builder.addCase(getQuotationById.pending, state => {
      state.updateQuotationsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(getQuotationById.fulfilled, (state, action) => {
      state.updateQuotationsStatus = defaultThunkSuccessState;
      if (Array.isArray(action.payload)) {
        quotationAdapter.upsertOne(state, action.payload[0]);
      } else {
        quotationAdapter.upsertOne(state, action.payload);
      }
    });
    builder.addCase(getQuotationById.rejected, (state, action) => {
      state.updateQuotationsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    //getCategories
    builder.addCase(getCategories.pending, state => {
      state.findCategoriesStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.findCategoriesStatus = defaultThunkSuccessState;
      state.categories = action.payload.data;
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.findCategoriesStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //createCategory
    builder.addCase(createCategory.pending, state => {
      state.updateCategoriesStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.updateCategoriesStatus = defaultThunkSuccessState;
      state.categories.push(action.payload);
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.updateCategoriesStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //updateCategory
    builder.addCase(updateCategory.pending, state => {
      state.updateCategoriesStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(updateCategory.fulfilled, (state, _action) => {
      state.updateCategoriesStatus = defaultThunkSuccessState;
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.updateCategoriesStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //
    builder.addCase(deleteCategory.pending, state => {
      state.updateCategoriesStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.updateCategoriesStatus = defaultThunkSuccessState;
      state.categories = state.categories.filter(
        _i => _i._id !== action.meta.arg,
      );
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.updateCategoriesStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //getCategoryById
    builder.addCase(getCategoryById.pending, state => {
      state.updateCategoriesStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(getCategoryById.fulfilled, (state, action) => {
      state.updateCategoriesStatus = defaultThunkSuccessState;
      state.categories = state.categories.filter(
        _i => _i._id !== action.meta.arg,
      );
    });
    builder.addCase(getCategoryById.rejected, (state, action) => {
      state.updateCategoriesStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    //getProducts
    builder.addCase(getProducts.pending, state => {
      state.findProductsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.findProductsStatus = defaultThunkSuccessState;
      state.products = action.payload.data;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.findProductsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //
    builder.addCase(createProduct.pending, state => {
      state.updateProductsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.updateProductsStatus = defaultThunkSuccessState;
      GAlert('Product creaetd successfully', MessageType.SUCCESS);
      state.products.push(action.payload);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.updateProductsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //updateCategory
    builder.addCase(updateProduct.pending, state => {
      state.updateProductsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(updateProduct.fulfilled, (state, _action) => {
      state.updateProductsStatus = defaultThunkSuccessState;
      GAlert('Product updated successfully', MessageType.SUCCESS);
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.updateProductsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //
    builder.addCase(deleteProduct.pending, state => {
      state.updateProductsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.updateProductsStatus = defaultThunkSuccessState;
      state.products = state.products.filter(_i => _i._id !== action.meta.arg);
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.updateProductsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    //getProductById
    builder.addCase(getProductById.pending, state => {
      state.updateProductsStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'No response',
      };
    });
    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.updateProductsStatus = defaultThunkSuccessState;
      state.products = state.products.filter(_i => _i._id !== action.meta.arg);
      state.products = [action.payload, ...state.products];
    });
    builder.addCase(getProductById.rejected, (state, action) => {
      state.updateProductsStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export const {restoreQuotationStore} = productSlice.actions;
export default productSlice.reducer;

export const {
  selectAll: selectAllQuotations,
  selectById: selectQuotationById,
  selectIds: selectQuotationIds,
} = quotationAdapter.getSelectors<RootState>(state => state.quotation);

export const quotationIdsSelector = createSelector(
  [selectQuotationIds],
  quotationIds => quotationIds,
);
export const quotationByIdSelector = createSelector(
  selectQuotationById,
  (product: Nillable<Quotation>) => {
    if (!isNil(product)) {
      return product;
    }
  },
);
export const selectCtegories = (state: RootState) => {
  return state.quotation.categories;
};
export const selectProducts = (state: RootState) => {
  return state.quotation.products.filter(_p => _p.isActive);
};
export const selectCtegoryById = (state: RootState, categoryId: string) => {
  return (
    state.quotation.categories.filter(_i => _i._id === categoryId)[0] || null
  );
};
export const selectProductById = (state: RootState, productId: string) => {
  return state.quotation.products.filter(_i => _i._id === productId)[0] || null;
};
export const getSectionQuotations = createSelector(
  [selectAllQuotations],
  quotations => {
    return Helper.formatDataDateWise(
      quotations.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }),
    );
  },
);
