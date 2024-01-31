import {Lead} from './lead';

export interface Activity {
  _id?: string | null;
  lead?: Lead;
  type: string;
  notes?: string;
  note?: string;
  label?: string;
  performedAt?: string;
  extraDetails?: any;
  createdTimestamp?: number;
  leadIds?: Array<string>;
  customFields?: Array<any>;
  createdBy?: string;
}
