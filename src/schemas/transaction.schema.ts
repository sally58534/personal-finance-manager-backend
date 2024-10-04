// src/transaction/schemas/transaction.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  id: string;
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  transactionId: string; // Unique transaction ID from Plaid

  @Prop()
  accountId?: string; // If you need to associate with an account

  @Prop()
  pending?: boolean;

  @Prop()
  paymentChannel?: string; // e.g., 'online', 'in store'

  @Prop()
  merchantName?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
