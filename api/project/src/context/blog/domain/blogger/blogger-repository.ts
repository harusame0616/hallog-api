import { Blogger } from './blogger';
import { BloggerId } from './blogger-id';

export interface BloggerRepository {
  findOneByBloggerId(bloggerId: BloggerId): Promise<Blogger | undefined>;
  insert(blogger: Blogger): Promise<void>;
  save(blogger: Blogger): Promise<void>;
}
