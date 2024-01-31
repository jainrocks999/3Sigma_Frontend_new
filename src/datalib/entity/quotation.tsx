import {Nillable} from '../../models/custom.types';
import {Lead} from './lead';
import {ProductSummary} from './product';

export interface Quotation {
  _id?: string;
  lead?: Lead | string;
  quotationId?: string;
  title?: string;
  logo?: string;
  createdDate?: any;
  attachFiles?: [string];
  note?: string;
  status?: string;
  quotationUrl?: string;
  additionalCharges?: Array<any>;
  taxes?: Array<any>;
  discount?: {
    type: string;
    rate: Nillable<number>;
  };
  subTotal?: number;
  total?: number;
  products?: Array<ProductSummary>;
  createdBy?: any;
  createdAt?: any;
}
