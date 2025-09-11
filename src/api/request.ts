import Axios from 'axios';
import { useMessage } from 'naive-ui';

const message = useMessage();

const refreshToken = () => axios.post('/auth/refresh');

const axios = Axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true,
});

// 请求拦截
axios.interceptors.request.use(config => {
  return config;
});

// 响应拦截
axios.interceptors.response.use(
  response => {
    let alert: string | null = null;
    for (const headerKey of Object.keys(response.headers)) {
      if (headerKey.toLowerCase().endsWith('app-alert')) {
        alert = response.headers[headerKey];
      }
    }
    if (alert) {
      message.success(alert);
    }
    return response;
  },
  async error => {
    const { config, response } = error;
    if (response) {
      switch (response.status) {
        case 400:
          message.error('请求无效');
          break;
        case 401:
          try {
            const whiteList = ['auth/login']
            if(whiteList.includes(config.url)) {
              return Promise.reject(error);
            }
            // 避免无限刷新循环
            if (!config._retry) {
              config._retry = true;
              await refreshToken();
              // 再次发送原请求
              return axios(config);
            }
          } catch (e) {
            message.error('尚未登录请重新登录');
            return Promise.reject({ code: 401, message: '尚未登录' });
          }
        case 403:
          message.error('您没有权限这样做，请联系管理员');
          break;
        case 404:
          message.error('请求未找到');
          break;
        case 504:
          message.error('请求超时，请稍后再试');
          break;
        default:
          message.error('系统异常');
          break;
      }
    }
    return Promise.reject(error);
  },
);
export default axios;
