import {User} from './user';

export interface Task {
  _id?: string | null;
  type: string;
  notes?: string;
  toBePerformAt?: Date | string | null;
  extraDetails?: any;
  assignedTo?: any;
  isCompleted?: boolean;
  repeat?: string;
  leadIds?: Array<string>;
  note?: string;
  lead?: string;
  createdBy?: User | string;
}
