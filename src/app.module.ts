import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOpitons } from 'db/data-source';
import { AuthModule } from 'src/modules/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOpitons),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
