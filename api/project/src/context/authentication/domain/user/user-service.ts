import { DuplicationError } from '../../../../error/duplication-error';
import { UserRepository } from '../user-repository';
import { User } from './user';

const ErrorMessage = {
  registeredEmail: '登録済みのメールアドレスです',
};

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async canRegister(user: User) {
    const registeredUser = await this.userRepository.findOneByEmail(user.email);
    if (registeredUser) {
      throw new DuplicationError(ErrorMessage.registeredEmail);
    }

    return true;
  }
}
