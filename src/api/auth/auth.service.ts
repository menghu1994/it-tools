import request from '@/api/request';

class AuthService {
  basicUrl = 'auth'
  constructor() {
  }

  login(params: any) {
    return request({
      url: `${this.basicUrl}/login`,
      method: 'POST',
      data: params,
    });
  }

  logout(): Promise<any> {
    return request({
      url: `${this.basicUrl}/logout`,
      method: 'POST'
    });
  }

  getAccount(): Promise<any> {
    return request({
      url: `${this.basicUrl}/account`,
      method: 'GET'
    });
  }

}

export const authService = new AuthService();
