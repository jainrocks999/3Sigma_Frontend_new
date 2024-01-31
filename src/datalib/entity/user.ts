import {Nillable} from '../../models/custom.types';
import {PrefrenceObject} from './prefrence';
import {UserSubscription} from './subscription';
import {Integration, UserIntegration} from './systemIntegration';
import {Role, Team, TeamMember} from './team';

export interface User {
  _id?: string;
  email?: string;
  extraDetails?: any;
  facebookId?: string;
  bucketUrl?: string;
  firstName?: string;
  lastName?: string;
  googleId?: string;
  hashCode?: string;
  isOnboardCompleted?: boolean;
  phone?: string;
  referralCode?: string;
  reportTo?: string;
  role?: string | any;
  salesTarget?: string;
  systemIntegration?: Array<Integration>;
  integration?: Array<UserIntegration>;
  team?: Array<object>;
  teamMembers?: Array<object>;
  userIntegration?: string;
  userIntegrations?: Array<UserIntegration>;
  userPreference: PrefrenceObject;
  walletAmount?: string;
  organization: Organisation;
  organizationEmployee?: Array<TeamMember>;
  organizationTeams?: Array<Team>;
  organizationRoles?: Array<Role>;
  teamSize?: number;
  companyName?: string;
  profile?: FileProps;
  isPhoneVerified?: boolean;
  isSubscriptionActive?: boolean;
  isEmailVerified?: boolean;
  isActive?: boolean;
  isTrailTaken?: boolean;
  subscription?: Nillable<UserSubscription>;
}
export interface UserProfile {
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    countryCode?: string;
  };
  organization: {
    name?: string;
    phone?: string;
    currency?: string;
    timeZone?: string;
    website?: string;
    address?: string;
    description?: string;
    teamSize?: number;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
  };
}
export interface Organisation {
  _id: string;
  name: string;
  phone: string;
  description: string;
  superAdmin: string;
  address?: any;
  currency?: string | null;
  socialLinks?: string | null;
}
export interface FileProps {
  fileName: string;
  filePath: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
}
