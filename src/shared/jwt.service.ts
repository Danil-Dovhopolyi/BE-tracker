import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) { }

  generateToken(user: User): string {
    const payload = { email: user.email, id: user.id };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
