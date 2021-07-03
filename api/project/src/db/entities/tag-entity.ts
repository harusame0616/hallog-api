import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ArticleEntity } from './article-entity';

@Entity()
export class TagEntity {
  @PrimaryColumn()
  name: string;

  @ManyToOne((type) => ArticleEntity, (article) => article.tags, {
    primary: true,
  })
  @JoinColumn({ name: 'articleId' })
  article: ArticleEntity;

  constructor(name: string, article: ArticleEntity) {
    this.name = name;
    this.article = article;
  }
}
