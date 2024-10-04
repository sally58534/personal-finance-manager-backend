// src/user/user.service.ts
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/schemas/user.schema';
import { INITIAL_ACCOUNT_ID } from 'src/utils/constants';
import { v4 as uuidv4 } from 'uuid';
import { BankAccount } from 'src/schemas/schemas-helper/user/user-accounts.schema-helper';
import { Institution } from 'plaid';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      email,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  // Find user by ID
  async findById(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }

  // Find user by email
  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  // Update user's Plaid access token
  async updateUserAccessToken(
    userId: string,
    accountId: string,
    accessToken: string,
  ): Promise<void> {
    try {
      const result = await this.userModel
        .updateOne(
          { _id: userId, 'accounts.id': accountId },
          { $set: { 'accounts.$.accessToken': accessToken } },
        )
        .exec();

      if (result.matchedCount === 0) {
        const newAccount: BankAccount = {
          accessToken,
          id: INITIAL_ACCOUNT_ID,
        };
        await this.userModel
          .updateOne({ _id: userId }, { $push: { accounts: newAccount } })
          .exec();
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Get user's Plaid access token
  async getUserAccessToken(
    userId: string,
    accountId?: string,
  ): Promise<string> {
    try {
      const user = await this.userModel.findById(userId).exec();
      return user.accounts.find((account) => account.id === accountId)
        .accessToken;
    } catch (error) {
      throw new BadRequestException('Account ID required in body');
    }
  }

  async updateUserAccounts(
    accounts: any,
    userId: string,
    institution?: Institution,
    accountId?: string,
  ): Promise<void> {
    try {
      const query = {
        $set: {
          'accounts.$.institution': institution,
          'accounts.$.internalAccounts': accounts,
        },
      };
      if (accountId === INITIAL_ACCOUNT_ID) {
        query.$set['accounts.$.id'] = uuidv4();
      }
      const user = await this.userModel
        .updateOne({ _id: userId, 'accounts.id': accountId }, query)
        .exec();
    } catch (error) {
      throw new BadRequestException('Account ID required in body');
    }
  }

  async getUserAccounts(userId: string): Promise<BankAccount[]> {
    try {
      const user = await this.userModel.findById(userId);
      console.log(user);
      return user.accounts;
    } catch (error) {
      throw new NotFoundException('Accounts not found for given id');
    }
  }
}
