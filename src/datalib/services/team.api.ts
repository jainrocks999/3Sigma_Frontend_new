import {Lead} from '../entity/lead';
import SecuredBaseApi from '../securedBase.api';
import {Response} from '../entity/response';
import {PaginationQuery} from '../entity/paginatedResult';
import {Role, Team, TeamMember} from '../entity/team';

class TeamApi extends SecuredBaseApi {
  public async getAllTeams(queryFilter: PaginationQuery): Promise<Array<Team>> {
    const response: Response = await this.securedAxios.get(
      '/team?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response.data);
  }
  public async getTeamById(teamId: string): Promise<Lead> {
    const response: Response = await this.securedAxios.get(`/team/${teamId}`);
    return Promise.resolve(response.data);
  }
  public async deleteTeamById(teamId: string): Promise<boolean> {
    const response: Response = await this.securedAxios.delete(
      `/team/${teamId}`,
    );
    return Promise.resolve(response.data);
  }
  public async updateTeam(team: Team): Promise<boolean> {
    const id = team._id;
    delete team._id;
    const response: Response = await this.securedAxios.put(`/team/${id}`, team);
    return Promise.resolve(response.status);
  }
  public async createTeam(team: Team): Promise<Team> {
    const response: Response = await this.securedAxios.post('/team', team);
    return Promise.resolve(response.data);
  }
  public async getAllEmployee(
    queryFilter: PaginationQuery,
  ): Promise<Array<TeamMember>> {
    const response: Response = await this.securedAxios.get(
      '/user/employee?' + this.bindQueryParams(queryFilter),
    );
    return Promise.resolve(response.data);
  }
  public async createEmployee(teamMember: TeamMember): Promise<TeamMember> {
    const response: Response = await this.securedAxios.post(
      '/user/employee',
      teamMember,
    );
    return Promise.resolve(response.data);
  }
  public async updateEmployee(teamMember: TeamMember): Promise<boolean> {
    const id = teamMember._id;
    delete teamMember._id;
    const response: Response = await this.securedAxios.put(
      `/user/employee/${id}`,
      teamMember,
    );
    return Promise.resolve(response.data);
  }

  public async getAllRoles(): Promise<Array<Role>> {
    const response: Response = await this.securedAxios.get('/role');
    return Promise.resolve(response.data);
  }
  public async createRole(role: Role): Promise<Role> {
    const response: Response = await this.securedAxios.post('/role', role);
    return Promise.resolve(response.data);
  }
  public async updateRole(role: Role): Promise<boolean> {
    const id = role._id;
    delete role._id;
    const response: Response = await this.securedAxios.put(`/role/${id}`, role);
    return Promise.resolve(response.status);
  }
}

export default TeamApi;
