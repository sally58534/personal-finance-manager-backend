import { InstitutionDto } from "./institution.schema-helper";
import { InternalAccount } from "./user-accounts-internal.schema-helper";

export class BankAccount {
  accessToken?: string;
  id: string;
  institution?: InstitutionDto;
  internalAccounts?: InternalAccount[];
}
