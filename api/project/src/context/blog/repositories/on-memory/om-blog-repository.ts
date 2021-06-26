import { Blog } from '../../domain/blog/blog';
import { BlogId } from '../../domain/blog/blog-id';
import { BlogRepository } from '../../domain/blog/blog-repository';
import { Blogger } from '../../domain/blogger/blogger';

export class OMBlogRepository implements BlogRepository {
  blogs: Blog[] = [];

  init() {
    this.blogs = [];
  }

  async findOneById(blogId: BlogId) {
    return this.blogs.find((blog) => blog.id.equals(blogId));
  }

  async findByOwner(blogger: Blogger) {
    return this.blogs.filter((blog) => blog.ownerId.equals(blogger.bloggerId));
  }

  async insert(blog: Blog): Promise<void> {
    this.blogs.push(blog);
  }

  async save(blog: Blog): Promise<void> {
    const index = this.blogs.findIndex((createdBlog) =>
      createdBlog.id.equals(blog.id)
    );
    if (index < 0) {
      this.blogs.push(blog);
    } else {
      this.blogs[index] = blog;
    }
  }
}
