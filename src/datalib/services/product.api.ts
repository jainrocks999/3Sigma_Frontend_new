import {Product} from '../entity/product';
import {PaginatedResult, PaginationMetadata} from '../entity/paginatedResult';
import SecuredBaseApi from '../securedBase.api';
import {Response} from '../entity/response';
import {Category} from '../entity/category';
import {Quotation} from '../entity/quotation';

class ProductApi extends SecuredBaseApi {
  public async getAllProduct(
    queryFilter: PaginationMetadata<number>,
  ): Promise<PaginatedResult<Product, number>> {
    const response: PaginatedResult<Product, number> =
      await this.securedAxios.get(
        '/product?' + this.bindQueryParams(queryFilter),
      );
    return Promise.resolve(response);
  }
  public async getProductById(productId: string): Promise<Product> {
    const response: Response = await this.securedAxios.get(
      `/product/${productId}`,
    );
    return Promise.resolve(response.data);
  }
  public async deleteProductById(productId: string): Promise<boolean> {
    const response: Response = await this.securedAxios.delete(
      `/product/${productId}`,
    );
    return Promise.resolve(response.data);
  }
  public async getSingleProduct(productId: string): Promise<Product> {
    const response: Response = await this.securedAxios.get(
      `/product/${productId}`,
    );
    return Promise.resolve(response.data);
  }
  public async updateProduct(product: Product): Promise<boolean> {
    const id = product._id;
    delete product._id;
    const response: Response = await this.securedAxios.put(
      `/product/${id}`,
      product,
    );
    return Promise.resolve(response.status);
  }
  public async createProduct(product: Product): Promise<Product> {
    const response: Response = await this.securedAxios.post(
      '/product',
      product,
    );
    return Promise.resolve(response.data);
  }

  public async getAllCategories(
    queryFilter: PaginationMetadata<number>,
  ): Promise<PaginatedResult<Category, number>> {
    const response: PaginatedResult<Category, number> =
      await this.securedAxios.get(
        '/category?' + this.bindQueryParams(queryFilter || {}),
      );
    return Promise.resolve(response);
  }
  public async createCategory(product: Category): Promise<Category> {
    const response: Response = await this.securedAxios.post(
      '/category',
      product,
    );
    return Promise.resolve(response.data);
  }
  public async getSingleCategory(productId: string): Promise<Category> {
    const response: Response = await this.securedAxios.get(
      `/category/${productId}`,
    );
    return Promise.resolve(response.data);
  }
  public async deleteCategoryById(categoryId: string): Promise<boolean> {
    const response: Response = await this.securedAxios.delete(
      `/category/${categoryId}`,
    );
    return Promise.resolve(response.data);
  }
  public async updateCategory(category: Category): Promise<boolean> {
    const id = category._id;
    delete category._id;
    const response: Response = await this.securedAxios.put(
      `/category/${id}`,
      category,
    );
    return Promise.resolve(response.status);
  }

  public async getAllQuotation(
    queryFilter: PaginationMetadata<number>,
  ): Promise<PaginatedResult<Quotation, number>> {
    const response: PaginatedResult<Quotation, number> =
      await this.securedAxios.get(
        '/quotation?' + this.bindQueryParams(queryFilter || {}),
      );
    return Promise.resolve(response);
  }
  public async createQuotation(product: Quotation): Promise<Quotation> {
    const response: Response = await this.securedAxios.post(
      '/quotation',
      product,
    );
    return Promise.resolve(response.data);
  }
  public async getSingleQuotation(productId: string): Promise<Quotation> {
    const response: Response = await this.securedAxios.get(
      `/quotation/${productId}`,
    );
    return Promise.resolve(response.data);
  }
  public async getQuotationId(): Promise<string> {
    const response: Response = await this.securedAxios.get(
      '/quotation/last-id',
    );
    return Promise.resolve(response.data.quotationId);
  }
  public async deleteQuotationById(quotationId: string): Promise<boolean> {
    const response: Response = await this.securedAxios.delete(
      `/quotation/${quotationId}`,
    );
    return Promise.resolve(response.data);
  }
  public async updateQuotation(category: Quotation): Promise<boolean> {
    const id = category._id;
    delete category._id;
    const response: Response = await this.securedAxios.put(
      `/quotation/${id}`,
      category,
    );
    return Promise.resolve(response.status);
  }
}

export default ProductApi;
