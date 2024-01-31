export interface FollowUps {
  _id?: string | null;
  type: string | null;
  toBePerformAt: string | null;
  isCompleted: boolean | null;
  organization: string | null;
  repeat: string | null;
  extraDetails: object | null;
  createdBy: string | null;
  createdAt: Date | null;
  lead: string | null;
  assignedTo: object | null;
}
