import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/jwt.auth.decorator';
import { CategoryDto, CategoryType, CreateCategoryDto, UpdateCategoryDto } from '../dtos/categories';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { CategoriesService } from '../services/category.service';

@ApiTags('categories')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category successfully created', type: CategoryDto })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<CategoryDto> {
    return this.categoriesService.create(createCategoryDto, user.sub);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all categories for current user' })
  @ApiResponse({ status: 200, description: 'List of categories', type: [CategoryDto] })
  findAll(@CurrentUser() user: JwtPayload): Promise<CategoryDto[]> {
    return this.categoriesService.findAll(user.sub);
  }

  @Get(':type')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all categories by type' })
  @ApiParam({ name: 'type', enum: CategoryType, description: 'Category type (income/expense)' })
  @ApiResponse({ status: 200, description: 'List of categories by type', type: [CategoryDto] })
  findByType(
    @Param('type') type: CategoryType,
    @CurrentUser() user: JwtPayload,
  ): Promise<CategoryDto[]> {
    return this.categoriesService.findAllByType(user.sub, type);
  }

  @Put(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category successfully updated', type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<CategoryDto> {
    return this.categoriesService.update(id, updateCategoryDto, user.sub);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category successfully deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    return this.categoriesService.remove(id, user.sub);
  }
}
