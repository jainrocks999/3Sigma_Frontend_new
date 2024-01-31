export interface DashBoard {
  _id?: string | null;
}
export interface StatusCount {}
export interface DashboardFilterParams {
  duration?: number | string;
  fromDate: string;
  toDate: string;
  teams?: string;
  userId?: string;
}
