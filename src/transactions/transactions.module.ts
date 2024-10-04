// src/transaction/transaction.module.ts
import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from 'src/schemas/transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionService } from './transactions.service';
import { PassportModule } from '@nestjs/passport';
import { PlaidService } from 'src/plaid/plaid.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/schemas/user.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    UserModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionService, PlaidService],
  exports: [TransactionService],
})
export class TransactionModule {}
