import request from '@/api/request';

class CategoryService {
  query() {
    return request({
      url: '/it-tools/note-categories',
      method: 'GET',
    });
  }

  create(data: { name: string }) {
    return request({
      url: '/it-tools/note-categories',
      method: 'POST',
      data,
    });
  }

  delete(id: string) {
    return request({
      url: `/it-tools/note-categories/${id}`,
      method: 'DELETE',
    });
  }
}

export const categoryService = new CategoryService();
