import request from '@/api/request';

export interface NotePayload {
  title: string
  content?: string
  category?: string
}

class NoteService {
  query(params?: { keyword?: string, category?: string, page?: number, size?: number }) {
    return request({
      url: '/it-tools/notes',
      method: 'GET',
      params,
    });
  }

  create(data: NotePayload) {
    return request({
      url: '/it-tools/notes',
      method: 'POST',
      data,
    });
  }

  update(id: string, data: NotePayload) {
    return request({
      url: `/it-tools/notes/${id}`,
      method: 'PATCH',
      data,
    });
  }

  delete(id: string) {
    return request({
      url: `/it-tools/notes/${id}`,
      method: 'DELETE',
    });
  }
}

export const noteService = new NoteService();
