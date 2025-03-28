
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import IUserRepository from '../interfaces/user.repository.interface';
import { UserRepository } from "../repositories/user.repository";


@Injectable()
export class UserRepositoryAuthDecorator implements IUserRepository {

  constructor(private readonly userRepository: UserRepository) { }
  async save(user: User): Promise<User> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return this.userRepository.save(user);
  }
  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
  findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
  deleteById(id: string): Promise<void> {
    return this.userRepository.deleteById(id);
  }

}