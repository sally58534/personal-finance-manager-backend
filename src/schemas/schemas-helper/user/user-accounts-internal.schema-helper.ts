import { AccountBalance } from "./user-balance.schema-helper";

export class InternalAccount {
  account_id?: string
  balances?: AccountBalance;
  mask?: string;
  name?: string;
  official_name?: string;
  persistent_account_id?: string;
  subtype?: string;
  type?: string;
}