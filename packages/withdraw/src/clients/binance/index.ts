import axios from 'axios';

import {
  BinanceConfig,
  CoinConfig,
  GetAllCoinsParams,
  WithdrawParams,
  WithdrawResponse,
} from './types.js';

import { buildQueryString, generateSignature } from '@/utils/signature.js';

const DEFAULT_BASE_URL = 'https://api.binance.com';

export class BinanceClient {
  private apiKey: string;
  private secretKey: string;
  private baseURL: string;
  private recvWindow: number;

  constructor(config: BinanceConfig) {
    this.apiKey = config.apiKey;
    this.secretKey = config.secretKey;
    this.baseURL = config.baseURL || DEFAULT_BASE_URL;
    this.recvWindow = config.recvWindow || 5000;
  }

  /**
   * Submit a withdraw request
   * @see https://developers.binance.com/docs/wallet/capital/withdraw
   */
  async withdraw(params: WithdrawParams): Promise<WithdrawResponse> {
    const timestamp = Date.now();

    const requestParams: Record<string, string | number | boolean | undefined> = {
      coin: params.coin,
      address: params.address,
      amount: params.amount,
      timestamp,
      recvWindow: params.recvWindow || this.recvWindow,
    };

    // Add optional parameters
    if (params.withdrawOrderId) {
      requestParams.withdrawOrderId = params.withdrawOrderId;
    }
    if (params.network) {
      requestParams.network = params.network;
    }
    if (params.addressTag) {
      requestParams.addressTag = params.addressTag;
    }
    if (params.transactionFeeFlag !== undefined) {
      requestParams.transactionFeeFlag = params.transactionFeeFlag;
    }
    if (params.name) {
      requestParams.name = params.name;
    }
    if (params.walletType !== undefined) {
      requestParams.walletType = params.walletType;
    }

    const queryString = buildQueryString(requestParams);
    const signature = generateSignature(queryString, this.secretKey);

    try {
      const response = await axios.post<WithdrawResponse>(
        `${this.baseURL}/sapi/v1/capital/withdraw/apply?${queryString}&signature=${signature}`,
        null,
        {
          headers: {
            'X-MBX-APIKEY': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data as { msg?: string; message?: string } | undefined;
        const errorMessage = errorData?.msg || errorData?.message || err.message;
        const statusCode = err.response.status;
        throw new Error(
          `Binance API error: ${errorMessage}${statusCode ? ` (${statusCode})` : ''}`,
        );
      }
      if (axios.isAxiosError(err)) {
        throw new Error(`Binance API error: ${err.message}`);
      }
      throw err;
    }
  }

  /**
   * Get information of coins (available for deposit and withdraw) for user
   * @see https://developers.binance.com/docs/wallet/capital/all-coins-information-user
   */
  async getAllCoins(params?: GetAllCoinsParams): Promise<CoinConfig[]> {
    const timestamp = Date.now();

    const requestParams: Record<string, string | number | undefined> = {
      timestamp,
      recvWindow: params?.recvWindow || this.recvWindow,
    };

    const queryString = buildQueryString(requestParams);
    const signature = generateSignature(queryString, this.secretKey);

    try {
      const response = await axios.get<CoinConfig[]>(
        `${this.baseURL}/sapi/v1/capital/config/getall?${queryString}&signature=${signature}`,
        {
          headers: {
            'X-MBX-APIKEY': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data as { msg?: string; message?: string } | undefined;
        const errorMessage = errorData?.msg || errorData?.message || err.message;
        const statusCode = err.response.status;
        throw new Error(
          `Binance API error: ${errorMessage}${statusCode ? ` (${statusCode})` : ''}`,
        );
      }
      if (axios.isAxiosError(err)) {
        throw new Error(`Binance API error: ${err.message}`);
      }
      throw err;
    }
  }
}
