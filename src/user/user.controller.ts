import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { BankAccount } from 'src/schemas/schemas-helper/user/user-accounts.schema-helper';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('accounts')
  async getUserAccounts(@GetUser() user: any): Promise<BankAccount[]> {
    try {
      const userId = user.id;
      const accounts = await this.userService.getUserAccounts(userId);
      return accounts;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
