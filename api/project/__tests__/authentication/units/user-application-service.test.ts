import jwt from 'jsonwebtoken';
import { UserApplicationService } from '../../../src/context/authentication/application/user-application-service';
import { UserRepository } from '../../../src/context/authentication/domain/user-repository';
import { Email } from '../../../src/context/authentication/domain/user/email';
import { HashPassword } from '../../../src/context/authentication/domain/user/hash-password';
import { PlainPassword } from '../../../src/context/authentication/domain/user/plain-password';
import {
  secret,
  User,
} from '../../../src/context/authentication/domain/user/user';
import { UserId } from '../../../src/context/authentication/domain/user/user-id';
import { AuthenticationError } from '../../../src/error/authentication-error';
import { DuplicationError } from '../../../src/error/duplication-error';

class TestUserRepository implements UserRepository {
  public users: User[];

  constructor() {
    this.users = [];
  }

  init() {
    this.users = [];
  }
  async insert(user: User): Promise<void> {
    this.users.push(user);
  }

  async findOneByEmail(email: Email): Promise<User | undefined> {
    return this.users.find((user) => user.email.equals(email));
  }
}

let repository = new TestUserRepository();
const uas = new UserApplicationService(repository);

describe('register', () => {
  beforeEach(() => {
    repository.init();
  });

  test('can register', async () => {
    const emailAddress = 'test1@test.com';
    const password = 'testtest';
    await uas.register(emailAddress, password);
    expect(repository.users.length).toBe(1);
    expect(repository.users[0].email.value).toBe(emailAddress);
    expect(repository.users[0].hashPassword.value).toBeTruthy();

    const emailAddress2 = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaatest2@test.com';
    const password2 = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    await uas.register(emailAddress2, password2);
    expect(repository.users.length).toBe(2);
    expect(repository.users[0].email.value).toBe(emailAddress);
    expect(repository.users[0].hashPassword.value).toBeTruthy();
  });

  test('register error by duplication email', async () => {
    const emailAddress = 'test1@test.com';
    const password = 'testtest';
    await uas.register(emailAddress, password);
    expect(repository.users.length).toBe(1);
    expect(repository.users[0].email.value).toBe(emailAddress);
    expect(repository.users[0].hashPassword.value).toBeTruthy();

    const registerPromise = uas.register(emailAddress, password);
    await expect(registerPromise).rejects.toThrowError(DuplicationError);
  });
});

describe('authenticate', () => {
  const email = 'test1@test.com';
  const password = 'testtest';

  repository.init();
  repository.insert(
    new User(
      UserId.createWithNewId(),
      new Email(email),
      HashPassword.fromPlainPassword(new PlainPassword(password))
    )
  );
  console.log(repository.users);
  test('can authenticate', async () => {
    const token = await uas.authenticate(email, password);
    expect(jwt.verify(token, secret)).toEqual({
      email: email,
      id: expect.anything(),
      iat: expect.anything(),
    });
  });

  test('authentication error', async () => {
    let promise = uas.authenticate(email + 'error', password);
    await expect(promise).rejects.toThrowError(AuthenticationError);

    promise = uas.authenticate(email, password + 'error');
    await expect(promise).rejects.toThrowError(AuthenticationError);
  });
});
