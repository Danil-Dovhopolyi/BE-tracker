import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../controllers/auth.controller';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../shared/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'hellomyfriend',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtService],
})
export class AuthModule { }
