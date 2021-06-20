import { AuthenticationError } from '../../../error/authentication-error';
import { UserRepository } from '../domain/user-repository';
import { Email } from '../domain/user/email';
import { HashPassword } from '../domain/user/hash-password';
import { PlainPassword } from '../domain/user/plain-password';
import { User } from '../domain/user/user';
import { UserId } from '../domain/user/user-id';
import { UserService } from '../domain/user/user-service';

const ErrorMessage = {
  authenticationFailed: '認証に失敗しました',
};

export class UserApplicationService {
  private userService;

  constructor(private userRepository: UserRepository) {
    this.userService = new UserService(userRepository);
  }

  async register(email: string, password: string) {
    const registerEmail = new Email(email);
    const registerHashPassword = HashPassword.fromPlainPassword(
      new PlainPassword(password)
    );

    const user = new User(
      UserId.createWithNewId(),
      registerEmail,
      registerHashPassword
    );
    await this.userService.canRegister(user);

    await this.userRepository.insert(user);
  }

  async authenticate(email: string, password: string) {
    const authEmail = new Email(email);
    const authPlainPassword = new PlainPassword(password);

    const user = await this.userRepository.findOneByEmail(authEmail);
    if (!user) {
      throw new AuthenticationError(ErrorMessage.authenticationFailed);
    }

    const isAuthenticated = user.authenticate(authEmail, authPlainPassword);
    if (!isAuthenticated) {
      throw new AuthenticationError(ErrorMessage.authenticationFailed);
    }

    return user.createToken();
  }
}
