import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dtos/user.dto';
import IUserRepository from 'src/interfaces/user.repository.interface';
import { User } from '../entities/user.entity';
import { JwtService } from '../shared/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService
  ) { }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = new User();
    newUser.email = email;
    newUser.password = password;

    return await this.userRepository.save(newUser);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.jwtService.generateToken(user);
  }

  async validateToken(token: string): Promise<any> {
    return this.jwtService.verifyToken(token);
  }
}
