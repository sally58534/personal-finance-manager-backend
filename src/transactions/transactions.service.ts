// src/transaction/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionDocument,
} from '../schemas/transaction.schema';
import { Model } from 'mongoose';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  // Save multiple transactions
  async saveTransactions(
    userId: string,
    transactionsData: any[],
  ): Promise<void> {
    const transactions = transactionsData.map((txnData) => ({
      userId,
      amount: txnData.amount,
      category:
        txnData.category && txnData.category.length > 0
          ? txnData.category[0]
          : 'Uncategorized',
      date: new Date(txnData.date),
      name: txnData.name,
      transactionId: txnData.transaction_id,
      accountId: txnData.account_id,
      pending: txnData.pending,
      paymentChannel: txnData.payment_channel,
      merchantName: txnData.merchant_name,
    }));

    // Upsert transactions to avoid duplicates
    for (const txn of transactions) {
      await this.transactionModel
        .updateOne(
          { transactionId: txn.transactionId },
          { $set: txn },
          { upsert: true },
        )
        .exec();
    }
  }

  // Retrieve transactions for a user
  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ userId }).exec();
  }

  // Additional methods as needed...
}
