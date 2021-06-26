import { Blogger } from '../../domain/blogger/blogger';
import { BloggerId } from '../../domain/blogger/blogger-id';
import { BloggerRepository } from '../../domain/blogger/blogger-repository';

export class OMBloggerRepository implements BloggerRepository {
  bloggers: Blogger[] = [];

  init() {
    this.bloggers = [];
  }

  async findOneByBloggerId(bloggerId: BloggerId): Promise<Blogger | undefined> {
    return this.bloggers.find((blogger) => blogger.bloggerId.equals(bloggerId));
  }
  async insert(blogger: Blogger): Promise<void> {
    this.bloggers.push(blogger);
  }
  async save(newBlogger: Blogger): Promise<void> {
    const index = this.bloggers.findIndex(
      (blogger) => blogger.bloggerId === newBlogger.bloggerId
    );
    if (index < 0) {
      this.bloggers.push(newBlogger);
    } else {
      this.bloggers[index] = newBlogger;
    }
  }
}
