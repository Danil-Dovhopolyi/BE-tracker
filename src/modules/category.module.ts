import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from 'src/controllers/category.controller';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';
import { CategoriesService } from '../services/category.service';
import { JwtService } from '../shared/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CategoriesService, JwtService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoryModule { }
