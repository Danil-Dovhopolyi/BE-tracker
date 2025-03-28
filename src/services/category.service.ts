import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDto, CategoryType, CreateCategoryDto, UpdateCategoryDto } from 'src/dtos/categories';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto, userId: string): Promise<CategoryDto> {
    const existingCategory = await this.categoriesRepository.findOne({
      where: {
        name: createCategoryDto.name,
        userId,
        type: createCategoryDto.type,
      },
    });

    if (existingCategory) {
      throw new ConflictException(`Category with name "${createCategoryDto.name}" already exists for this type`);
    }

    const newCategory = this.categoriesRepository.create({
      ...createCategoryDto,
      userId,
    });

    const savedCategory = await this.categoriesRepository.save(newCategory);
    return this.mapToDto(savedCategory);
  }

  async findAll(userId: string): Promise<CategoryDto[]> {
    const categories = await this.categoriesRepository.find({
      where: { userId },
    });

    return categories.map(category => this.mapToDto(category));
  }

  async findAllByType(userId: string, type: CategoryType): Promise<CategoryDto[]> {
    const categories = await this.categoriesRepository.find({
      where: { userId, type },
    });

    return categories.map(category => this.mapToDto(category));
  }

  async findOne(id: string, userId: string): Promise<CategoryDto> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return this.mapToDto(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string): Promise<CategoryDto> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: {
          name: updateCategoryDto.name,
          userId,
          type: updateCategoryDto.type || category.type,
        },
      });

      if (existingCategory) {
        throw new ConflictException(`Category with name "${updateCategoryDto.name}" already exists for this type`);
      }
    }

    const updatedCategory = await this.categoriesRepository.save({
      ...category,
      ...updateCategoryDto,
    });

    return this.mapToDto(updatedCategory);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    await this.categoriesRepository.remove(category);
  }

  async getDefaultCategories(): Promise<Category[]> {
    return [
      { name: 'Salary', type: 'income', iconName: 'briefcase', color: '#4CAF50' },
      { name: 'Bonus', type: 'income', iconName: 'gift', color: '#8BC34A' },
      { name: 'Investments', type: 'income', iconName: 'trending-up', color: '#2196F3' },

      { name: 'Food', type: 'expense', iconName: 'shopping-basket', color: '#F44336' },
      { name: 'Transport', type: 'expense', iconName: 'car', color: '#FF9800' },
      { name: 'Utilities', type: 'expense', iconName: 'home', color: '#9C27B0' },
      { name: 'Entertainment', type: 'expense', iconName: 'film', color: '#E91E63' },
      { name: 'Healthcare', type: 'expense', iconName: 'activity', color: '#00BCD4' },
    ] as Category[];
  }

  async createDefaultCategories(userId: string): Promise<void> {
    const defaultCategories = await this.getDefaultCategories();

    for (const category of defaultCategories) {
      const newCategory = this.categoriesRepository.create({
        ...category,
        userId,
      });
      await this.categoriesRepository.save(newCategory);
    }
  }

  private mapToDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      type: category.type,
      iconName: category.iconName,
      color: category.color,
    };
  }
}