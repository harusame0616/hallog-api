import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['bloggerId', 'nickname'])
export class BloggerEntity {
  @PrimaryColumn({ length: 36 })
  bloggerId: string;

  @Column({ length: 64 })
  nickname: string;

  @Column({ length: 1024 })
  prComment: string;

  constructor(bloggerId: string, nickname: string, prComment: string) {
    this.bloggerId = bloggerId;
    this.nickname = nickname;
    this.prComment = prComment;
  }
}
