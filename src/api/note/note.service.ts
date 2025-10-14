import CrudService from '@/api/crud.service';

class NoteService extends CrudService {
  constructor() {
    super('notes')
  }

}

export const noteService = new NoteService();