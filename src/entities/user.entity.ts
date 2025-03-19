import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

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
}
