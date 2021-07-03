import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TagEntity } from './tag-entity';

@Entity()
export class ArticleEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  blogId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  isPublic: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updateAt: Date;

  @OneToMany((type) => TagEntity, (tag) => tag.article)
  tags!: TagEntity[];

  constructor(
    id: string,
    blogId: string,
    title: string,
    content: string,
    isPublic: boolean,
    createdAt: Date,
    updateAt: Date
  ) {
    this.id = id;
    this.blogId = blogId;
    this.title = title;
    this.content = content;
    this.isPublic = isPublic;
    this.createdAt = createdAt;
    this.updateAt = updateAt;
  }
}
