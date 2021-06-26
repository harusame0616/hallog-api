import { randomUUID } from 'crypto';
import { BloggerApplicationService } from '../../../src/context/blog/application/blogger-application-service';
import { OMBloggerRepository } from '../../../src/context/blog/repositories/on-memory/om-blogger-repository';
import { DuplicationError } from '../../../src/error/duplication-error';
import { NotFoundError } from '../../../src/error/not-found-error';

const bloggerRepository = new OMBloggerRepository();
const uas = new BloggerApplicationService(bloggerRepository);

describe('register', () => {
  beforeAll(() => {
    bloggerRepository.init();
  });
  test('can register', async () => {
    const bloggerId = randomUUID();
    const nickname = 'nickname';
    const prComment = 'PRComment';
    await uas.register(bloggerId, nickname, prComment);

    expect(bloggerRepository.bloggers.length).toBe(1);
    expect(bloggerRepository.bloggers[0].bloggerId.value).toBe(bloggerId);
    expect(bloggerRepository.bloggers[0].nickname.value).toBe(nickname);
    expect(bloggerRepository.bloggers[0].prComment.value).toBe(prComment);
  });

  test('register error by duplication id', async () => {
    const bloggerId = randomUUID();
    const nickname = 'nickname';
    const prComment = 'PRComment';
    await uas.register(bloggerId, nickname, prComment);
    const registerPromise = uas.register(bloggerId, nickname, prComment);

    await expect(registerPromise).rejects.toThrowError(DuplicationError);
  });
});

describe('update', () => {
  const bloggerId = randomUUID();
  const nickname = 'nickname';
  const prComment = 'PRComment';
  const newNickname = 'newNickname';
  const newPrComment = 'newPRComment';

  beforeAll(async () => {
    bloggerRepository.init();
    await uas.register(bloggerId, nickname, prComment);
  });

  test('can update', async () => {
    await uas.update(bloggerId, { nickname: newNickname });
    expect(bloggerRepository.bloggers[0].bloggerId.value).toBe(bloggerId);
    expect(bloggerRepository.bloggers[0].nickname.value).toBe(newNickname);
    expect(bloggerRepository.bloggers[0].prComment.value).toBe(prComment);

    await uas.update(bloggerId, { prComment: newPrComment });
    expect(bloggerRepository.bloggers[0].bloggerId.value).toBe(bloggerId);
    expect(bloggerRepository.bloggers[0].nickname.value).toBe(newNickname);
    expect(bloggerRepository.bloggers[0].prComment.value).toBe(newPrComment);

    await uas.update(bloggerId, { nickname, prComment });
    expect(bloggerRepository.bloggers[0].bloggerId.value).toBe(bloggerId);
    expect(bloggerRepository.bloggers[0].nickname.value).toBe(nickname);
    expect(bloggerRepository.bloggers[0].prComment.value).toBe(prComment);
  });

  test('update error by not registered', async () => {
    const updatePromise = uas.update(randomUUID(), { nickname: newNickname });
    await expect(updatePromise).rejects.toThrowError(NotFoundError);
  });
});

describe('getProfile', () => {
  const bloggerId = randomUUID();
  const nickname = 'nickname';
  const prComment = 'PRComment';

  beforeAll(async () => {
    bloggerRepository.init();
    await uas.register(bloggerId, nickname, prComment);
  });

  test('can get profile', async () => {
    const profile = await uas.getProfile(bloggerId);

    expect(profile).toEqual({
      bloggerId,
      nickname,
      prComment,
    });
  });

  test('get profile error by not registered', async () => {
    const getProfilePromise = uas.getProfile(randomUUID());

    await expect(getProfilePromise).rejects.toThrowError(NotFoundError);
  });
});
