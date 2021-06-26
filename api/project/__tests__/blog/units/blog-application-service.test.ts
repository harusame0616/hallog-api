import { randomUUID } from 'crypto';
import { BlogApplicationService } from '../../../src/context/blog/application/blog-application-service';
import { Blogger } from '../../../src/context/blog/domain/blogger/blogger';
import { BloggerId } from '../../../src/context/blog/domain/blogger/blogger-id';
import { Nickname } from '../../../src/context/blog/domain/blogger/nickname';
import { PrComment } from '../../../src/context/blog/domain/blogger/pr-comment';
import { OMBlogRepository } from '../../../src/context/blog/repositories/on-memory/om-blog-repository';
import { OMBloggerRepository } from '../../../src/context/blog/repositories/on-memory/om-blogger-repository';

const blogRepository = new OMBlogRepository();
const bloggerRepository = new OMBloggerRepository();
const application = new BlogApplicationService(
  blogRepository,
  bloggerRepository
);

describe('create', () => {
  test('can create', async () => {
    const bloggerId = randomUUID();
    await bloggerRepository.insert(
      new Blogger(
        new BloggerId(bloggerId),
        new Nickname('test'),
        new PrComment('テスト作ってます')
      )
    );

    const description = 'test description';
    const title = 'test title';
    const blogId = 'test-id';

    await application.create(blogId, title, description, bloggerId);

    const blog = blogRepository.blogs[0];
    expect(blog).toEqual({
      _id: { value: blogId },
      _title: title,
      _description: description,
      _ownerId: { value: bloggerId },
    });
  });
});
