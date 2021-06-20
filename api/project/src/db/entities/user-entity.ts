import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['userId', 'email'])
export class UserEntity {
  @PrimaryColumn({ length: 36 })
  userId: string;

  @PrimaryColumn({ length: 254 })
  email: string;

  @Column({ length: 60 })
  hashPassword: string;

  constructor(userId: string, email: string, hashPassword: string) {
    this.userId = userId;
    this.email = email;
    this.hashPassword = hashPassword;
  }
}
