import { Blog } from '../domain/blog/blog';
import { BlogId } from '../domain/blog/blog-id';
import { BlogRepository } from '../domain/blog/blog-repository';
import { BlogService } from '../domain/blog/blog-service';
import { BloggerId } from '../domain/blogger/blogger-id';
import { BloggerRepository } from '../domain/blogger/blogger-repository';

export class BlogApplicationService {
  private _blogService;
  private _blogRepository;
  private _bloggerRepository;

  constructor(
    blogRepository: BlogRepository,
    bloggerRepository: BloggerRepository
  ) {
    this._blogRepository = blogRepository;
    this._bloggerRepository = bloggerRepository;
    this._blogService = new BlogService(bloggerRepository, blogRepository);
  }

  async create(
    id: string,
    title: string,
    description: string,
    ownerId: string
  ) {
    const blog = new Blog(
      new BlogId(id),
      title,
      description,
      new BloggerId(ownerId)
    );

    await this._blogService.canCreate(blog);
    await this._blogRepository.save(blog);
  }
}
