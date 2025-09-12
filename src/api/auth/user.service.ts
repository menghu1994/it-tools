import CrudService from '@/api/crud.service';

class UserService extends CrudService {
  constructor() {
    super('users')
  }

}

export const userService = new UserService();
