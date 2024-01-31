export interface DistributionConfig {
  organization?: string;
  team?: string;
  createdBy?: string;
  integration?: string;
  ruleConfig?: any;
  recipientsIds?: any;
  status?: boolean;
  configType?: string;
  leadSource?: string;
}
export interface DistributionRule {
  name?: string;
  organization?: string;
  team?: string;
  createdBy?: string;
  integration?: string;
  ruleConfig?: {fieldName: string; fieldValue: string};
  recipientsIds?: any;
  status?: boolean;
  configType?: string;
  leadSource?: string;
  _id?: string;
}
