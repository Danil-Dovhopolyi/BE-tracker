import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/services/auth.service';
import { CreateUserDto } from '../dtos/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login an existing user and return a JWT token' })
  @ApiResponse({ status: 200, description: 'JWT token generated successfully', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() body: { email: string; password: string }): Promise<{ token: string }> {
    return { token: await this.authService.login(body.email, body.password) };
  }
}