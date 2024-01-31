import {BulkActionPayload, Lead} from '../entity/lead';
import SecuredBaseApi from '../securedBase.api';
import {Response} from '../entity/response';
import {
  LeadFilterMetadata,
  PaginatedResult,
  PaginationQuery,
} from '../entity/paginatedResult';
import {Note} from '../entity/note';

class LeadApi extends SecuredBaseApi {
  public async getAllLeads(
    queryFilter: PaginationQuery,
  ): Promise<PaginatedResult<Lead, number>> {
    delete queryFilter.total;
    const response: PaginatedResult<Lead, number> = await this.securedAxios.get(
      '/lead?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response);
  }
  public async getLeadNotes(
    queryFilter: PaginationQuery,
  ): Promise<PaginatedResult<Note, number>> {
    delete queryFilter.total;
    const response: PaginatedResult<Note, number> = await this.securedAxios.get(
      '/note?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response);
  }
  public async getLeadsById(leadId: string): Promise<Lead> {
    const response: Response = await this.securedAxios.get(
      `/lead/${leadId}/v2`,
    );
    return Promise.resolve(response.data);
  }
  public async addNotesData(payload: Note): Promise<Note> {
    const response: Response = await this.securedAxios.post('/note', payload);
    return Promise.resolve(response.data);
  }

  public async uploadLeadCsv(payload: object): Promise<boolean> {
    try {
      const response: any = await this.securedAxios.post('/lead/csv', payload, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      return Promise.resolve(response.status);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async leadFilterData(
    filterParams: LeadFilterMetadata,
  ): Promise<PaginatedResult<Lead, number>> {
    const response: PaginatedResult<Lead, number> =
      await this.securedAxios.post('/lead/filter', filterParams);
    return Promise.resolve(response);
  }
  public async addLeadsData(values: Lead): Promise<Lead> {
    const response: Response = await this.securedAxios.post('/lead', values);
    return Promise.resolve(response.data);
  }
  public async updateLeadsData(values: Lead): Promise<boolean> {
    const id = values._id;
    delete values._id;
    const response: Response = await this.securedAxios.put(
      `/lead/${id}`,
      values,
    );
    return Promise.resolve(response.status);
  }

  public async copyLeadsInList(payload: BulkActionPayload): Promise<string> {
    const response: Response = await this.securedAxios.post(
      '/lead-distribution/copy-lead-in-list',
      payload,
    );
    return Promise.resolve(response.message);
  }
  public async moveLeadsInList(payload: BulkActionPayload): Promise<string> {
    const response: Response = await this.securedAxios.post(
      '/lead-distribution/move-lead-in-list',
      payload,
    );
    return Promise.resolve(response.message);
  }
  public async uploadFile(payload: FormData): Promise<boolean> {
    try {
      const response: Response = await this.securedAxios.post(
        '/utility/file-upload',
        payload,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      );
      return Promise.resolve(response.status);
    } catch (error) {
      console.log(error);
    }
  }
  public async deleteFiles(payload: any): Promise<boolean> {
    const response: Response = await this.securedAxios.put(
      '/utility/delete-file',
      payload,
    );
    return Promise.resolve(response.status);
  }
  public async updateLeadsStatus(payload: BulkActionPayload): Promise<string> {
    const response: Response = await this.securedAxios.put(
      '/lead/status',
      payload,
    );
    return Promise.resolve(response.message);
  }
  public async updateLeadsLabels(payload: BulkActionPayload): Promise<string> {
    const response: Response = await this.securedAxios.put(
      '/lead/label',
      payload,
    );
    return Promise.resolve(response.message);
  }
  public async deleteBulkLeads(payload: BulkActionPayload): Promise<string> {
    const response: Response = await this.securedAxios.post(
      '/lead/bulk-delete',
      payload,
    );
    return Promise.resolve(response.message);
  }
  public async bulkAssignLeads(payload: BulkActionPayload): Promise<string> {
    const response: Response = await this.securedAxios.put(
      '/lead/bulk-lead-assign',
      payload,
    );
    return Promise.resolve(response.message);
  }
  public async transferLead(payload: {
    fromUser: 'string';
    toUser: 'string';
  }): Promise<string> {
    const response: Response = await this.securedAxios.put(
      '/lead/transfer',
      payload,
    );
    return Promise.resolve(response.message);
  }
}

export default LeadApi;
