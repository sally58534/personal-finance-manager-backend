// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Exclude password from returned user object
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  // Login and generate JWT token
  async login(user: any) {
    const userConvert = user._doc as User;
    const userId = userConvert._id;
    const payload = { sub: userId, email: userConvert.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Register a new user
  async register(email: string, password: string): Promise<User> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    return this.userService.createUser(email, password);
  }
}
