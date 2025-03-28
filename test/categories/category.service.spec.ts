import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryType } from '../../src/dtos/categories';
import { Category } from '../../src/entities/category.entity';
import { User } from '../../src/entities/user.entity';
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

  const mockUser = {
    id: 'user1',
    email: 'test@example.com',
  };

  const mockCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  describe('create', () => {
    it('should create a new category', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockCategoryRepository.findOne.mockResolvedValue(null);
      mockCategoryRepository.create.mockReturnValue(mockCategory);
      mockCategoryRepository.save.mockResolvedValue(mockCategory);

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
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);

      await expect(service.create({
        name: mockCategory.name,
        type: mockCategory.type,
      }, mockCategory.userId)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create({
        name: mockCategory.name,
        type: mockCategory.type,
      }, mockCategory.userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all categories for user', async () => {
      mockCategoryRepository.find.mockResolvedValue([mockCategory]);

      const result = await service.findAll(mockCategory.userId);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining({
        name: mockCategory.name,
      }));
    });
  });

  describe('findAllByType', () => {
    it('should return categories by type', async () => {
      mockCategoryRepository.find.mockResolvedValue([mockCategory]);

      const result = await service.findAllByType(mockCategory.userId, CategoryType.EXPENSE);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(CategoryType.EXPENSE);
    });
  });

  describe('update', () => {
    it('should update existing category', async () => {
      const updatedCategory = { ...mockCategory, name: 'Updated Name' };
      mockCategoryRepository.findOne
        .mockImplementation(({ where }) => {
          if (where.id === '1') {
            return Promise.resolve(mockCategory);
          }
          return Promise.resolve(null); // No duplicate found
        });
      mockCategoryRepository.save.mockResolvedValue(updatedCategory);

      const result = await service.update('1', { name: 'Updated Name' }, mockCategory.userId);
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', { name: 'Updated Name' }, mockCategory.userId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove existing category', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockCategoryRepository.remove.mockResolvedValue(undefined);

      await expect(service.remove('1', mockCategory.userId)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1', mockCategory.userId)).rejects.toThrow(NotFoundException);
    });
  });
});
