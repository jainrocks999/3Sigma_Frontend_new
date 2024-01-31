export interface List {
  name: string;
  distributionType?: string;
  isDistributionActive?: boolean;
  readAccess?: Array<string>;
  recipients?: {
    cursor: string | null;
    currentDistribution: string | null;
    ids: object;
  };
  _id?: string;
}
