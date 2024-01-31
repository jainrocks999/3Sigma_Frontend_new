import {Task} from 'react-native';
import {Activity} from './activity';
import {Note} from './note';
import {LeadFilterMetadata} from './paginatedResult';
import {Integration} from './systemIntegration';

export interface Lead {
  _id?: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  extraDetails?: any | null;
  address?: object | null;
  customField?: any | null;
  files?: Array<any> | null;
  companyName?: string | null;
  status?: Array<string> | null;
  label?: Array<string> | null;
  notesArr?: Array<any> | null;
  saleValue?: number;
  integration?: string | Integration;
  customSource?: any;
  whatsApp?: string | null;
  createdAt?: Date | null;
  isDistributed?: boolean;
  activities?: Array<Activity>;
  tasks?: Array<Task>;
  notes?: Array<Note>;
  note?: string;
  list?: string;
  createdBy?: string;
  assignedTo?: string;
}

export interface ModalPhoneContact {
  display: boolean | null;
  close: () => void;
  title?: string | null;
  // data, selectedItem,
}
export interface FilterParams {
  sort?: SortParams;
  paginationParams?: PaginationParams;
  search?: string;
  note?: string;
  date?: string;
  label?: Array<string>;
  status?: Array<string>;
  source?: Array<string>;
  teams?: Array<string>;
  byOrganization?: boolean;
  teamMembers?: Array<string>;
  activity?: object;
  customField?: string;
  followup?: {
    isFollowup: boolean;
    single: {
      start: Date;
      end: Date;
    };
  };
  assign?: {
    isAssign: boolean;
    teamMembers: Array<string>;
  };
}
export interface PaginationParams {
  page: number;
  perPage: number;
}
export interface SortParams {
  orderBy: string;
  isAscending: boolean;
}
export interface BulkActionPayload {
  leadIDs?: Array<string> | null;
  leadIds?: Array<string> | null;
  isAll?: boolean;
  targetListId?: string | null;
  filterPrams?: LeadFilterMetadata | null;
  label?: Array<string>;
  status?: string;
  assignToUser?: string;
}
export interface BulkSelectionMetadata {
  leadIds: Array<string>;
  bulkSelectionStatus: boolean;
  selectAllStatus: boolean;
}
