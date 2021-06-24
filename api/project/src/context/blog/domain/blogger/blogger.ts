import { BloggerId } from './blogger-id';
import { Nickname } from './nickname';
import { PrComment } from './pr-comment';

export class Blogger {
  constructor(
    public bloggerId: BloggerId,
    public nickname: Nickname,
    public prComment: PrComment
  ) {}

  changeNickname(nickname: Nickname) {
    this.nickname = nickname;
  }

  changePRComment(prComment: PrComment) {
    this.prComment = prComment;
  }
}
