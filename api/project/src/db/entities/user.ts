import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  constructor(id: string, firstName: string, lastName: string, age: number) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }
}
