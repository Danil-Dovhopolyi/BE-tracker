import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from 'src/controllers/category.controller';
import { Category } from '../entities/category.entity';
import { CategoriesService } from '../services/category.service';
import { JwtService } from '../shared/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [CategoriesService, JwtService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoryModule { }
