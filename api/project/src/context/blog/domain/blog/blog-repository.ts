import { Blogger } from '../blogger/blogger';
import { Blog } from './blog';
import { BlogId } from './blog-id';

export interface BlogRepository {
  findOneById(id: BlogId): Promise<Blog | undefined>;
  findByOwner(blogger: Blogger): Promise<Blog[]>;
  save(blog: Blog): Promise<void>;
}
