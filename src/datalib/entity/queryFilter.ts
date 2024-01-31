export interface QueryFilter {
  page?: number | null;
  offset?: number | null;
  limit?: number | null;
  filter?: LeadFilter;
}

interface LeadFilter {
  leadStatus: string | null;
  leadLabel: string | null;
}
