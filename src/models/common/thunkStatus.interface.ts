import {Nillable} from '../custom.types';
import {ThunkResultEnum, ThunkStatusEnum} from './thunkStatus.enum';

export interface ThunkStatus {
  error?: Nillable<string>;
  result?: ThunkResultEnum;
  status?: ThunkStatusEnum;
  statusMessage?: string;
}
