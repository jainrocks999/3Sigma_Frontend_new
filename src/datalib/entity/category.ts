export interface Category {
  _id?: string;
  name?: string;
  description?: string | null;
  color?: string | null;
  status?: string;
}

export interface Categories {
  data?: Array<Category>;
}
