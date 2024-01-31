import {Content, SharePayload} from '../entity/content';
import {PaginatedResult, PaginationMetadata} from '../entity/paginatedResult';
import SecuredBaseApi from '../securedBase.api';
import {Response} from '../entity/response';

class ContentApi extends SecuredBaseApi {
  public async getAllContent(
    queryFilter: PaginationMetadata<number>,
  ): Promise<PaginatedResult<Content, number>> {
    const response: PaginatedResult<Content, number> =
      await this.securedAxios.get(
        '/content?' + this.bindQueryParams(queryFilter),
      );
    return Promise.resolve(response);
  }
  public async getContentById(contentId: string): Promise<Content> {
    const response: Response = await this.securedAxios.get(
      `/content/${contentId}`,
    );
    return Promise.resolve(response.data);
  }
  public async deleteContentById(contentId: string): Promise<boolean> {
    const response: Response = await this.securedAxios.delete(
      `/content/${contentId}`,
    );
    return Promise.resolve(response.data);
  }
  public async getSingleContent(contentId: string): Promise<Content> {
    const response: Response = await this.securedAxios.get(
      `/content/${contentId}`,
    );
    return Promise.resolve(response.data);
  }
  public async updateContent(content: Content): Promise<boolean> {
    const id = content._id;
    delete content._id;
    const response: Response = await this.securedAxios.put(
      `/content/${id}`,
      content,
    );
    return Promise.resolve(response.status);
  }
  public async createContent(content: Content): Promise<Content> {
    const response: Response = await this.securedAxios.post(
      '/content',
      content,
    );
    return Promise.resolve(response.data);
  }
  public async shareContent(content: SharePayload): Promise<any> {
    const response: Response = await this.securedAxios.post(
      '/content/share',
      content,
    );
    return Promise.resolve(response.data);
  }
}

export default ContentApi;
