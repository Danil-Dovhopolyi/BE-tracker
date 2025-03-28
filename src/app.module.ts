import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOpitons } from 'db/data-source';
import { AuthModule } from 'src/modules/auth.module';
import { CategoryModule } from './modules/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOpitons),
    AuthModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
