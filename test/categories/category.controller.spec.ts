import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../src/controllers/category.controller';
import { CategoryType } from '../../src/dtos/categories';
import { JwtAuthGuard } from '../../src/guards/jwt-auth.guard';
import { CategoriesService } from '../../src/services/category.service';
import { JwtService } from '../../src/shared/jwt.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockUser = {
    sub: 'user1',
    email: 'test@example.com',
    role: 'user',
  };

  const mockCategory = {
    id: '1',
    name: 'Test Category',
    type: CategoryType.EXPENSE,
    iconName: 'test-icon',
    color: '#000000',
  };

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByType: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    verifyToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('create', () => {
    it('should create a new category', async () => {
      mockCategoriesService.create.mockResolvedValue(mockCategory);

      const result = await controller.create({
        name: mockCategory.name,
        type: mockCategory.type,
        iconName: mockCategory.iconName,
        color: mockCategory.color,
      }, mockUser);

      expect(result).toEqual(mockCategory);
      expect(service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCategory.name,
          type: mockCategory.type,
        }),
        mockUser.sub,
      );
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      mockCategoriesService.findAll.mockResolvedValue([mockCategory]);

      const result = await controller.findAll(mockUser);

      expect(result).toEqual([mockCategory]);
      expect(service.findAll).toHaveBeenCalledWith(mockUser.sub);
    });
  });

  describe('findByType', () => {
    it('should return categories by type', async () => {
      mockCategoriesService.findAllByType.mockResolvedValue([mockCategory]);

      const result = await controller.findByType(CategoryType.EXPENSE, mockUser);

      expect(result).toEqual([mockCategory]);
      expect(service.findAllByType).toHaveBeenCalledWith(
        mockUser.sub,
        CategoryType.EXPENSE,
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updatedCategory = { ...mockCategory, name: 'Updated Name' };
      mockCategoriesService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update(
        '1',
        { name: 'Updated Name' },
        mockUser,
      );

      expect(result).toEqual(updatedCategory);
      expect(service.update).toHaveBeenCalledWith(
        '1',
        { name: 'Updated Name' },
        mockUser.sub,
      );
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      mockCategoriesService.remove.mockResolvedValue(undefined);

      await controller.remove('1', mockUser);

      expect(service.remove).toHaveBeenCalledWith('1', mockUser.sub);
    });
  });
});
