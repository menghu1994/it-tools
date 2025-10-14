import CrudService from '@/api/crud.service';

class CategoryService extends CrudService {
  constructor() {
    super('categories')
  }

}

export const categoryService = new CategoryService();