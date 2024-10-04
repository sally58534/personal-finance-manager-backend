// src/transaction/transaction.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionService } from './transactions.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { PlaidService } from 'src/plaid/plaid.service';
import { formatDate } from 'src/utils/utils';
import { UserService } from 'src/user/user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly plaidService: PlaidService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async getUserTransactions(@GetUser() user: any, @Body() body) {
    const { startDate, endDate, accountId, accountIds } = body;
    const userId = user.id;
    const accessToken = await this.userService.getUserAccessToken(
      userId,
      accountId,
    );
    const transactions = await this.plaidService.getTransactions(
      accessToken,
      startDate || '1980-01-01',
      endDate || formatDate(new Date()),
      accountIds,
    );
    return transactions;
  }
}
