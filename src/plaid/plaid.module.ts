// src/plaid/plaid.module.ts
import { Module } from '@nestjs/common';
import { PlaidController } from './plaid.controller';
import { PlaidService } from './plaid.service';
import { UserModule } from '../user/user.module';
import { TransactionModule } from 'src/transactions/transactions.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [UserModule, TransactionModule],
  controllers: [PlaidController],
  providers: [PlaidService],
})
export class PlaidModule {}
