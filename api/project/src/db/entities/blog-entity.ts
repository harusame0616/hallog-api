import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['id'])
export class BlogEntity {
  @PrimaryColumn({ length: 36 })
  id: string;

  @Column({ length: 64 })
  title: string;

  @Column({ length: 1024 })
  description: string;

  @PrimaryColumn({ length: 36 })
  ownerId: string;

  constructor(id: string, title: string, description: string, ownerId: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
  }
}
