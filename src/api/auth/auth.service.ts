import request from '@/api/request';

export default class AuthService {
  constructor() {
  }

  login(params: any) {
    return request({
      url: `auth/login`,
      method: 'POST',
      data: params,
    });
  }

  logout() {
    return request({
      url: `auth/logout`,
      method: 'POST'
    });
  }

}
