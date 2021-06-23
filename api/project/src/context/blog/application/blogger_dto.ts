import { Blogger } from '../domain/blogger/blogger';

export class BloggerDTOTranslator {
  static toDTO(blogger: Blogger) {
    return {
      bloggerId: blogger.bloggerId.value,
      nickname: blogger.nickname.value,
      prComment: blogger.prComment.value,
    };
  }
}
