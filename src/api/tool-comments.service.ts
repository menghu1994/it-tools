import request from '@/api/request';

class ToolCommentsService {
  list(toolKey: string) {
    return request({
      url: '/it-tools/comments',
      method: 'GET',
      params: { toolKey },
    });
  }

  create(data: { toolKey: string, content: string, parentId?: string }) {
    return request({
      url: '/it-tools/comments',
      method: 'POST',
      data,
    });
  }

  vote(id: string, type: 'upvote' | 'downvote') {
    return request({
      url: `/it-tools/comments/${id}/vote`,
      method: 'PUT',
      data: { type },
    });
  }

  remove(id: string) {
    return request({
      url: `/it-tools/comments/${id}`,
      method: 'DELETE',
    });
  }

  restore(id: string) {
    return request({
      url: `/it-tools/comments/${id}/restore`,
      method: 'PUT',
    });
  }

  adminList(params?: { toolKey?: string, keyword?: string, isActive?: boolean, page?: number, size?: number }) {
    return request({
      url: '/it-tools/comments/admin',
      method: 'GET',
      params,
    });
  }
}

export const toolCommentsService = new ToolCommentsService();
