import request from './request';

// 快速创建 增删改查api
export default class CrudService {
  url: string;

  constructor(serviceUrl: string) {
    this.url = '/' + serviceUrl;
  }

  create(params: any) {
    return request({
      url: this.url,
      method: 'POST',
      data: params,
    });
  }

  query(params?: any) {
    return request({
      url: this.url,
      method: 'GET',
      params,
    });
  }

  find(id: string) {
    return request({
      url: `${this.url}/${id}`,
      method: 'GET',
    });
  }

  update(id: number | string, params: any) {
    return request({
      url: `${this.url}/${id}`,
      method: 'PUT',
      params,
    });
  }

  delete(id: number | string) {
    return request({
        url: `${this.url}/${id}`,
        method: 'DELETE',
      },
    );
  }

  exportTemplate() {
    return request({
      url: `${this.url}/export-template`,
      method: 'PUT',
      responseType: 'blob',
    });
  }

  import() {
    return request({
      url: `${this.url}/import`,
      method: 'PUT',
    });
  }

  export() {
    return request({
      url: `${this.url}/export`,
      method: 'PUT',
      responseType: 'blob',
    });
  }
}
