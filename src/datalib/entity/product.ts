import {Category} from './category';

export interface Product {
  createdAt?: any;
  _id?: string;
  name?: string | null;
  productId?: string | null;
  category?: Category | string;
  description?: string | null;
  images?: Array<string> | null;
  currency?: string | null;
  unitType?: string | null;
  price?: any;
  isActive?: boolean;
  createdBy?: any;
}
export interface ProductSummary {
  id: string;
  quantity: number;
  unitPrice: number;
  description: string;
}
