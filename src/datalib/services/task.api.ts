import {Task} from '../entity/task';
import SecuredBaseApi from '../securedBase.api';
import {Response} from '../entity/response';
import {PaginatedResult, PaginationMetadata} from '../entity/paginatedResult';
class TaskApi extends SecuredBaseApi {
  public async getAlltask(
    queryFilter: PaginationMetadata<number>,
  ): Promise<PaginatedResult<Task, number>> {
    const response: PaginatedResult<Task, number> = await this.securedAxios.get(
      '/task?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response);
  }
  public async createTask(payload: Task): Promise<Task> {
    const response: Response = await this.securedAxios.post('/task', payload);
    return Promise.resolve(response.data);
  }
  public async getTaskById(taskId: string): Promise<Task> {
    const response: Response = await this.securedAxios.get(`/task/${taskId}`);
    return Promise.resolve(response.data);
  }
  public async updateTask(payload: Task): Promise<boolean> {
    const id = payload._id;
    delete payload._id;
    const response: Response = await this.securedAxios.put(
      `/task/${id}`,
      payload,
    );
    return Promise.resolve(response.status);
  }
  public async deleteTask(list: string): Promise<boolean> {
    const response: Response = await this.securedAxios.delete(
      `/task/${list}`,
    );
    return Promise.resolve(response.status);
  }
}

export default TaskApi;
