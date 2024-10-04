// src/plaid/plaid.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { PlaidService } from './plaid.service';
import { UserService } from '../user/user.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { TransactionService } from 'src/transactions/transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { formatDate } from 'src/utils/utils';
import { INITIAL_ACCOUNT_ID } from 'src/utils/constants';

@UseGuards(AuthGuard('jwt'))
@Controller('plaid')
export class PlaidController {
  constructor(
    private readonly plaidService: PlaidService,
    private readonly userService: UserService,
  ) {}

  @Post('create_link_token')
  async createLinkToken(@GetUser() user: any) {
    const userId = user.id;
    const linkToken = await this.plaidService.createLinkToken(userId);
    return { linkToken };
  }

  @Post('exchange_public_token')
  async exchangePublicToken(@GetUser() user: any, @Body() body: any) {
    const { publicToken, accoundId } = body;
    const userId = user.id;
    const accessToken =
      await this.plaidService.exchangePublicToken(publicToken);
    await this.userService.updateUserAccessToken(
      userId,
      accoundId,
      accessToken,
    );
    return { message: 'Token exchanged successfully' };
  }

  @Patch('saveUserAccounts')
  async updateUserAccounts(
    @GetUser() user: any,
    @Body('accountId') accountId: string = INITIAL_ACCOUNT_ID,
  ) {
    try {
      const userId = user.id;
      const accessToken = await this.userService.getUserAccessToken(
        userId,
        accountId,
      );
      const userBankAccounts =
        await this.plaidService.getUserAccounts(accessToken);

      const institution = await this.plaidService.getInstitutionName(
        userBankAccounts.item.institution_id,
      );

      await this.userService.updateUserAccounts(
        userBankAccounts.accounts,
        userId,
        institution,
        accountId,
      );
      return userBankAccounts;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
