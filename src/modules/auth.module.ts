import { Module } from '@nestjs/common';
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
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1d' },
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
