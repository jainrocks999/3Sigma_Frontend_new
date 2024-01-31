export interface Integration {
  isPremium: boolean;
  key: string;
  name: string;
  type: string;
  _id: string;
  isDisplayable: boolean;
  isActive: boolean;
}
export interface UserIntegration {
  details: any;
  logs: any;
  isActive: true;
  isDeleted: true;
  userIntegrationId: string;
  integrationId: string;
  integrationName: string;
  integrationKey: string;
  integration: Integration;
  user: string;
}
