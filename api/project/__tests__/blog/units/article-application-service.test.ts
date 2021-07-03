import { randomUUID } from 'crypto';
import { ArticleApplicationService } from '../../../src/context/blog/application/article-application-service';
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

describe('post', () => {
  const title = 'test article';
  const content = 'this is article for testing.';
  const tags = ['test', 'blog', 'article'];

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

    const blog = new Blog(
      new BlogId(blogId),
      blogName,
      blogDescription,
      new BloggerId(bloggerId)
    );
    await blogRepository.insert(blog);
  });
  test('can test', async () => {
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
