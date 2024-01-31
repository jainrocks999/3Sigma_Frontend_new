export interface Team {
  teamOwner?: any;
  reportTo?: any;
  _id?: string;
  name?: string;
  organization?: string;
  teamMembers?: string;
  createdBy?: string;
  createdAt?: string;
  isActive?: boolean;
}
export interface TeamMember {
  _id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  countryCode?: string;
  email?: string;
  role?: string;
  reportTo?: Array<string>;
  team?: any;
  teams?: any;
  salesTarget?: string;
  isOrganizationMember?: boolean;
  isActive?: boolean;
}
export interface Role {
  _id?: string;
  name?: string;
  displayName?: string;
  permissions?: Array<any>;
  reportTo?: string;
}
