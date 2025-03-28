import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'Salary', description: 'Category name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: CategoryType, example: CategoryType.INCOME, description: 'Category type' })
  @IsNotEmpty()
  @IsEnum(CategoryType)
  type: CategoryType;

  @ApiProperty({ example: 'briefcase', required: false, description: 'Icon name for the category' })
  @IsOptional()
  @IsString()
  iconName?: string;

  @ApiProperty({ example: '#4CAF50', required: false, description: 'Color code for the category' })
  @IsOptional()
  @IsString()
  color?: string;
}