// plaid.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PlaidApi,
  Configuration,
  PlaidEnvironments,
  Products,
  CountryCode,
  Institution,
  AccountBase,
  AccountsGetResponse,
} from 'plaid';

@Injectable()
export class PlaidService {
  private plaidClient: PlaidApi;

  constructor(private configService: ConfigService) {
    const config = new Configuration({
      basePath: PlaidEnvironments[configService.get('PLAID_ENV')],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': configService.get('PLAID_CLIENT_ID'),
          'PLAID-SECRET': configService.get('PLAID_SECRET'),
        },
      },
    });
    this.plaidClient = new PlaidApi(config);
  }

  async createLinkToken(userId: string): Promise<string> {
    const response = await this.plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'Your App Name',
      products: [Products.Transactions],
      country_codes: [CountryCode.It],
      language: 'it',
    });

    return response.data.link_token;
  }

  async exchangePublicToken(publicToken: string): Promise<string> {
    const response = await this.plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    return response.data.access_token;
  }

  async getTransactions(
    accessToken: string,
    startDate: string,
    endDate: string,
    account_ids: string[]
  ) {
    const response = await this.plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: {
        account_ids,
        offset: 0,
      },
    });
    return response.data;
  }

  async getUserAccounts(access_token: string): Promise<AccountsGetResponse> {
    try {
      const response = await this.plaidClient.accountsGet({
        access_token,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getInstitutionName(
    instId: string = 'ins_131863',
  ): Promise<Institution> {
    try {
      const institution = await this.plaidClient.institutionsGetById({
        institution_id: instId,
        country_codes: [CountryCode.It ],
      });
      return institution.data.institution;
    } catch (error) {
      console.log(error);
    }
  }
}
