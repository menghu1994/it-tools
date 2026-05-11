import request from '@/api/request';

class ItToolsService {
  account() {
    return request({
      url: '/it-tools/account',
      method: 'GET',
    });
  }

  updateAccount(data: { name?: string, email?: string, avatar?: string }) {
    return request({
      url: '/it-tools/account',
      method: 'PATCH',
      data,
    });
  }

  recharge(amountYuan: number) {
    return request({
      url: '/it-tools/recharge',
      method: 'POST',
      data: { amountYuan },
    });
  }

  enterTool(toolKey: string) {
    return request({
      url: '/it-tools/usage/enter',
      method: 'POST',
      data: { toolKey },
    });
  }

  toolAccess(toolKey: string) {
    return request({
      url: '/it-tools/access',
      method: 'GET',
      params: { toolKey },
    });
  }

  consumeAdvancedFeature(toolKey: string, featureKey: string, cost = 1) {
    return request({
      url: '/it-tools/usage/advanced',
      method: 'POST',
      data: { toolKey, featureKey, cost },
    });
  }

  favorites() {
    return request({
      url: '/it-tools/favorites',
      method: 'GET',
    });
  }

  updateFavorites(favoriteTools: string[]) {
    return request({
      url: '/it-tools/favorites',
      method: 'PATCH',
      data: { favoriteTools },
    });
  }

  adminUsers(params?: { username?: string, pageSize?: number }) {
    return request({
      url: '/it-tools/admin/users',
      method: 'GET',
      params,
    });
  }

  adminToolQuotas(params?: { userId?: string, toolKey?: string, date?: string }) {
    return request({
      url: '/it-tools/admin/tool-quotas',
      method: 'GET',
      params,
    });
  }

  adminToolAccess() {
    return request({
      url: '/it-tools/admin/tool-access',
      method: 'GET',
    });
  }

  saveToolAccess(data: {
    toolKey: string
    controlled?: boolean
    loginRequired?: boolean
    dailyLimit?: number
    costPerUse?: number
    advancedCost?: number
  }) {
    return request({
      url: '/it-tools/admin/tool-access',
      method: 'POST',
      data,
    });
  }

  saveToolQuota(data: {
    userId: string
    toolKey: string
    controlled?: boolean
    loginRequired?: boolean
    dailyLimit?: number
    costPerUse?: number
    advancedCost?: number
  }) {
    return request({
      url: '/it-tools/admin/tool-quotas',
      method: 'POST',
      data,
    });
  }
}

export const itToolsService = new ItToolsService();
