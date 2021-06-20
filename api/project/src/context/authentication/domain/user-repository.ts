import { Email } from './user/email';
import { User } from './user/user';

export interface UserRepository {
  insert(user: User): Promise<void>;
  findOneByEmail(email: Email): Promise<User | undefined>;
}
