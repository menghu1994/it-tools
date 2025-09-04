import CrudService from '@/api/crud.service';

export default class UserService extends CrudService {
  constructor() {
    super('users')
  }

}
