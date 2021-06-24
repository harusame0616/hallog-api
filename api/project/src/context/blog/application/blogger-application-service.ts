import { NotFoundError } from '../../../error/not-found-error';
import { Blogger } from '../domain/blogger/blogger';
import { BloggerId } from '../domain/blogger/blogger-id';
import { BloggerRepository } from '../domain/blogger/blogger-repository';
import { BloggerService } from '../domain/blogger/blogger-service';
import { Nickname } from '../domain/blogger/nickname';
import { PrComment } from '../domain/blogger/pr-comment';
import { BloggerDTOTranslator } from './blogger_dto';

interface bloggerParameter {
  nickname: string;
  prComment: string;
}


const ErrorMessages = {
  bloggerNotFound: 'ブロガーが見つかりません',
};

export class BloggerApplicationService {
  private readonly bloggerService;
  private readonly bloggerRepository;

  constructor(bloggerRepository: BloggerRepository) {
    this.bloggerRepository = bloggerRepository;
    this.bloggerService = new BloggerService(bloggerRepository);
  }

  /**
   * 登録する
   * @param nickname
   * @param email
   * @param prComment
   * @returns
   */
  async register(id: string, nickname: string, prComment: string) {
    const blogger = new Blogger(
      new BloggerId(id),
      new Nickname(nickname),
      new PrComment(prComment)
    );

    await this.bloggerService.canRegister(blogger);
    await this.bloggerRepository.insert(blogger);
  }

  async update(
    bloggerId: string,
    { nickname, prComment }: Partial<bloggerParameter>
  ) {
    let blogger = await this.bloggerRepository.findOneByBloggerId(
      new BloggerId(bloggerId)
    );

    if (!blogger) {
      throw new NotFoundError(ErrorMessages.bloggerNotFound);
    }

    if (nickname !== undefined) {
      blogger.changeNickname(new Nickname(nickname));
    }

    if (prComment !== undefined) {
      blogger.changePRComment(new PrComment(prComment));
    }

    return await this.bloggerRepository.save(blogger);
  }

  async getProfile(id: string) {
    const blogger = await this.bloggerRepository.findOneByBloggerId(
      new BloggerId(id)
    );
    if (!blogger) {
      throw new NotFoundError(ErrorMessages.bloggerNotFound);
    }

    return {
      ...BloggerDTOTranslator.toDTO(blogger),
    };
  }
}
