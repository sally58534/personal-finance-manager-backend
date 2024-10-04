// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // User registration
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.authService.register(email, password);
    return { id: user._id, email: user.email };
  }

  // User login
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  // Protected route example
  @UseGuards(AuthGuard('jwt'))
  @Post('test')
  test(@Request() req) {
    return { message: 'Authenticated', user: req.user };
  }
}
