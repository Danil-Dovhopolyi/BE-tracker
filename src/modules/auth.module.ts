import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../controllers/auth.controller';
import { UserRepositoryAuthDecorator } from '../decorators/user.repository.auth.decorator';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../shared/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    UserRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryAuthDecorator,
    },
  ],
  exports: ['IUserRepository', JwtService],
})
export class AuthModule { }
