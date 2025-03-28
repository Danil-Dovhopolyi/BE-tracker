import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', default: 'user' })
  role: string;

  @OneToMany(() => Category, category => category.user)
  categories: Category[];
}
