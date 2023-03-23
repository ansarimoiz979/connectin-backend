import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO, LoginUserDTO } from '../user/dto';
import { UserTokensInterface } from '../user/entities/user.entity';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  // @UseGuards(LocalAuthGuard)
  // @HttpCode(200)
  @Post('login')
  // async login(@Request() req): Promise<UserTokensInterface> {
    async login(@Body() payload: LoginUserDTO): Promise<UserTokensInterface> {
    return await this.authService.login(payload);
  }

  @ApiOperation({ summary: 'Register' })
  @Post('register')
  // async register(@Body() payload: CreateUserDTO): Promise<UserTokensInterface> {
    async register(@Body() payload: CreateUserDTO): Promise<any> {
    const user = await this.authService.register(payload);
    return user;
  }
}
