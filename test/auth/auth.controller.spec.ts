import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register(mockUser);
      expect(result).toEqual(mockUser);
      expect(authService.register).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('login', () => {
    it('should return JWT token', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockToken = 'jwt-token';

      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await controller.login(mockCredentials);
      expect(result).toEqual({ token: mockToken });
      expect(authService.login).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password,
      );
    });
  });
});
