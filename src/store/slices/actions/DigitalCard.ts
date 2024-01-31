import {createAsyncThunk} from '@reduxjs/toolkit';
import {Digitalcard} from 'datalib/entity/digitalcard';
import DigitalCardApi from 'datalib/services/digitalcard.api';

export const getDigitalCard = createAsyncThunk<
  Digitalcard,
  void,
  {rejectValue: string}
>('digitalcard/get', async (id, {rejectWithValue}) => {
  try {
    return await new DigitalCardApi().getDigitalCardById();
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
export const createDigitalCard = createAsyncThunk<
  Digitalcard,
  Digitalcard,
  {rejectValue: string}
>('digitalcard/create', async (payload: Digitalcard, {rejectWithValue}) => {
  try {
    return await new DigitalCardApi().createDigitalCard(payload);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});

export const updateDigitalCard = createAsyncThunk<
  boolean,
  Digitalcard,
  {rejectValue: string}
>('digitalcard/update', async (payload: Digitalcard, {rejectWithValue}) => {
  try {
    return await new DigitalCardApi().updateDigitalCard(payload);
  } catch (error: any) {
    return rejectWithValue(error.code);
  }
});
