import Axios from 'axios';
import { createDiscreteApi } from 'naive-ui';

const { message } = createDiscreteApi(['message']);

const ACCESS_TOKEN_KEY = 'it_tools_access_token';
const REFRESH_TOKEN_KEY = 'it_tools_refresh_token';

export function setAuthTokens(tokens: { access_token?: string, refresh_token?: string }) {
  if (tokens.access_token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  }
  if (tokens.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  }
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function readCookie(name: string) {
  const target = `${name}=`;
  return document.cookie
    .split(';')
    .map(item => item.trim())
    .find(item => item.startsWith(target))
    ?.slice(target.length);
}

const axios = Axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true,
});

async function refreshToken() {
  const refresh_token = getRefreshToken();
  if (!refresh_token) {
    throw new Error('Missing refresh token');
  }

  const res = await axios.post('/auth/refresh', { refresh_token });
  setAuthTokens(res.data);
  return res;
}

axios.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  const csrfToken = readCookie('csrf_token');
  if (csrfToken && !config.headers['x-csrf-token']) {
    config.headers['x-csrf-token'] = csrfToken;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => {
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
  async (error) => {
    const { config, response } = error;
    if (!response) {
      return Promise.reject(error);
    }

    switch (response.status) {
      case 400:
        message.error('请求无效');
        break;
      case 401: {
        const whiteList = ['/auth/login', 'auth/login', '/auth/refresh', 'auth/refresh'];
        if (whiteList.includes(config?.url)) {
          return Promise.reject(error);
        }

        try {
          if (!config._retry) {
            config._retry = true;
            await refreshToken();
            return axios(config);
          }
        } catch (e) {
          clearAuthTokens();
          message.error('尚未登录，请重新登录');
          return Promise.reject({ code: 401, message: '尚未登录' });
        }

        return Promise.reject(error);
      }
      case 402:
        message.error('金币不足，请先充值');
        break;
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

    return Promise.reject(error);
  },
);

export default axios;
