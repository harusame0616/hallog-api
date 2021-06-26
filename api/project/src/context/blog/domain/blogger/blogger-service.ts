import { DuplicationError } from '../../../../error/duplication-error';
import { Blogger } from './blogger';
import { BloggerRepository } from './blogger-repository';

const ErrorMessage = {
  registeredBloggerId: '登録済みのIDです',
};

export class BloggerService {
  constructor(private bloggerRepository: BloggerRepository) {}

  async canRegister(blogger: Blogger) {
    const registeredBlogger = await this.bloggerRepository.findOneByBloggerId(
      blogger.bloggerId
    );

    if (registeredBlogger) {
      throw new DuplicationError(ErrorMessage.registeredBloggerId);
    }

    return true;
  }
}
