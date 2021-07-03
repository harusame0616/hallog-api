import { randomUUID } from 'crypto';
import { ArticleApplicationService } from '../../../src/context/blog/application/article-application-service';
import { Article } from '../../../src/context/blog/domain/article/article';
import { ArticleId } from '../../../src/context/blog/domain/article/article-id';
import { Blog } from '../../../src/context/blog/domain/blog/blog';
import { BlogId } from '../../../src/context/blog/domain/blog/blog-id';
import { Blogger } from '../../../src/context/blog/domain/blogger/blogger';
import { BloggerId } from '../../../src/context/blog/domain/blogger/blogger-id';
import { Nickname } from '../../../src/context/blog/domain/blogger/nickname';
import { PrComment } from '../../../src/context/blog/domain/blogger/pr-comment';
import { OMArticleRepository } from '../../../src/context/blog/repositories/on-memory/om-article-repository';
import { OMBlogRepository } from '../../../src/context/blog/repositories/on-memory/om-blog-repository';
import { OMBloggerRepository } from '../../../src/context/blog/repositories/on-memory/om-blogger-repository';
import { NotFoundError } from '../../../src/error/not-found-error';
import { PermissionError } from '../../../src/error/permission-error';

const bloggerRepository = new OMBloggerRepository();
const blogRepository = new OMBlogRepository();
const articleRepository = new OMArticleRepository();

const app = new ArticleApplicationService(
  blogRepository,
  bloggerRepository,
  articleRepository
);

const bloggerId = randomUUID();
const bloggerId2 = randomUUID();
const nickname = 'test-user';
const prComment = 'Bello!!';

const blogId = 'test-blog';
const blogName = "test user's test blog !!";
const blogDescription = 'this blog is for testing';

beforeAll(async () => {
    await bloggerRepository.insert(
      new Blogger(
        new BloggerId(bloggerId),
        new Nickname(nickname),
        new PrComment(prComment)
      )
    );

    await bloggerRepository.insert(
      new Blogger(
        new BloggerId(bloggerId2),
        new Nickname(nickname),
        new PrComment(prComment)
      )
    );

    await blogRepository.insert(
      new Blog(
        new BlogId(blogId),
        blogName,
        blogDescription,
        new BloggerId(bloggerId)
      )
    );
})

describe('post', () => {
  const title = 'test article';
  const content = 'this is article for testing.';
  const tags = ['test', 'blog', 'article'];

  beforeEach(() => {
    articleRepository.init();
   })

  test('can post', async () => {
    await app.post(bloggerId, blogId, title, content, tags, true);

    expect(articleRepository.articles.length).toBe(1);
    expect(articleRepository.articles[0].blogId.value).toEqual(blogId);
    expect(articleRepository.articles[0].title).toEqual(title);
    expect(articleRepository.articles[0].content).toEqual(content);
    expect(articleRepository.articles[0].tags).toEqual(
      expect.arrayContaining(tags)
    );
    expect(articleRepository.articles[0].isPublic).toEqual(true);
  });

  test("throws error if blog owner isn'nt poster", async () => {
    const promise = app.post(bloggerId2, blogId, title, content, tags, true);
    await expect(promise).rejects.toThrowError(PermissionError);
  });

  test("throws error if blog doesn't exists", async () => {
    const promise = app.post(bloggerId, 'no-blog', title, content, tags, true);
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  test("throws error if blogger doesn't exists", async () => {
    const promise = app.post(randomUUID(), blogId, title, content, tags, true);
    await expect(promise).rejects.toThrowError(NotFoundError);
  });
});

describe('read', () => {
  const articleId = randomUUID();
  const articleId2 = randomUUID();
  const title = 'test article';
  const content = 'this is article for testing.';
  const tags = ['test', 'blog', 'article'];

  beforeAll(async () => {
    articleRepository.init();

    await articleRepository.insert(
      new Article(
        new ArticleId(articleId),
        new BlogId(blogId),
        title,
        content,
        tags,
        true,
        new Date(),
        new Date()
      )
    );

    await articleRepository.insert(
      new Article(
        new ArticleId(articleId2),
        new BlogId(blogId),
        title,
        content,
        tags,
        false,
        new Date(),
        new Date()
      )
    );
  });

  test('can read', async () => {
    const article = await app.read(articleId);

    expect(article).toEqual({
      title: title,
      content: content,
      tags: expect.arrayContaining(tags),
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
    });
  });

  test("throws error if article dosn't exists", async () => {
    const promise = app.read(randomUUID());
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  test('throws error if article is hidden', async () => {
    const promise = app.read(articleId2);
    await expect(promise).rejects.toThrowError(PermissionError);
  });
});
