import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from "./category-create.dto";

export class CategoryDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Salary' })
  name: string;

  @ApiProperty({ enum: CategoryType, example: CategoryType.INCOME })
  type: CategoryType;

  @ApiProperty({ example: 'briefcase', required: false })
  iconName?: string;

  @ApiProperty({ example: '#4CAF50', required: false })
  color?: string;

  @ApiProperty({ example: 5, required: false })
  transactionCount?: number;
}