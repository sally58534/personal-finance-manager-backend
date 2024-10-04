import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaidService } from './plaid/plaid.service';
import { PlaidController } from './plaid/plaid.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaidModule } from './plaid/plaid.module';
import { TransactionModule } from './transactions/transactions.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/personal-finance'),
    UserModule,
    PlaidModule,
    TransactionModule,
    AuthModule,
    // ... other modules
  ],
  controllers: [AppController, PlaidController],
  providers: [AppService, PlaidService],
})
export class AppModule {}
