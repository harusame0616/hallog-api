import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ArticleEntity } from './article-entity';

@Entity()
export class TagEntity {
  @PrimaryColumn()
  name: string;

  @Column()
  readonly articleId: string;
  @ManyToOne((type) => ArticleEntity, (article) => article.tags, {
    primary: true,
  })
  @JoinColumn({ name: 'articleId' })
  article?: ArticleEntity;

  constructor(name: string, articleId: string, articleEntity?: ArticleEntity) {
    this.name = name;
    this.articleId = articleId;
    this.article = articleEntity;
  }
}
