import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryType } from '../../src/dtos/categories';
import { Category } from '../../src/entities/category.entity';
import { CategoriesService } from '../../src/services/category.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  const mockCategory = {
    id: '1',
    name: 'Test Category',
    type: CategoryType.EXPENSE,
    iconName: 'test-icon',
    color: '#000000',
    userId: 'user1',
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  describe('create', () => {
    it('should create a new category', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockCategory);
      mockRepository.save.mockResolvedValue(mockCategory);

      const result = await service.create({
        name: mockCategory.name,
        type: mockCategory.type,
        iconName: mockCategory.iconName,
        color: mockCategory.color,
      }, mockCategory.userId);

      expect(result).toEqual(expect.objectContaining({
        name: mockCategory.name,
        type: mockCategory.type,
      }));
    });

    it('should throw ConflictException if category already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockCategory);

      await expect(service.create({
        name: mockCategory.name,
        type: mockCategory.type,
      }, mockCategory.userId)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all categories for user', async () => {
      mockRepository.find.mockResolvedValue([mockCategory]);

      const result = await service.findAll(mockCategory.userId);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining({
        name: mockCategory.name,
      }));
    });
  });

  describe('findAllByType', () => {
    it('should return categories by type', async () => {
      mockRepository.find.mockResolvedValue([mockCategory]);

      const result = await service.findAllByType(mockCategory.userId, CategoryType.EXPENSE);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(CategoryType.EXPENSE);
    });
  });

  describe('update', () => {
    it('should update existing category', async () => {
      const updatedCategory = { ...mockCategory, name: 'Updated Name' };
      mockRepository.findOne
        .mockImplementation(({ where }) => {
          if (where.id === '1') {
            return Promise.resolve(mockCategory);
          }
          return Promise.resolve(null); // No duplicate found
        });
      mockRepository.save.mockResolvedValue(updatedCategory);

      const result = await service.update('1', { name: 'Updated Name' }, mockCategory.userId);
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException if category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', { name: 'Updated Name' }, mockCategory.userId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove existing category', async () => {
      mockRepository.findOne.mockResolvedValue(mockCategory);
      mockRepository.remove.mockResolvedValue(undefined);

      await expect(service.remove('1', mockCategory.userId)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1', mockCategory.userId)).rejects.toThrow(NotFoundException);
    });
  });
});
