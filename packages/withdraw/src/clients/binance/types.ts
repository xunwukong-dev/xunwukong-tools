/**
 * Withdraw request parameters
 */
export interface WithdrawParams {
  coin: string;
  address: string;
  amount: string | number;
  withdrawOrderId?: string;
  network?: string;
  addressTag?: string;
  transactionFeeFlag?: boolean;
  name?: string;
  walletType?: 0 | 1; // 0 = spot wallet, 1 = funding wallet
  recvWindow?: number;
}

/**
 * Withdraw response
 */
export interface WithdrawResponse {
  id: string;
}

/**
 * Binance API configuration
 */
export interface BinanceConfig {
  apiKey: string;
  secretKey: string;
  baseURL?: string;
  recvWindow?: number;
}

/**
 * Coin configuration from getAllCoins API
 */
export interface CoinConfig {
  coin: string;
  depositAllEnable: boolean;
  withdrawAllEnable: boolean;
  name: string;
  free: string;
  locked: string;
  freeze: string;
  withdrawing: string;
  ipoing: string;
  ipoable: string;
  storage: string;
  isLegalMoney: boolean;
  trading: boolean;
  networkList: NetworkConfig[];
}

/**
 * Network configuration for a coin
 */
export interface NetworkConfig {
  network: string;
  coin: string;
  withdrawIntegerMultiple: string;
  isDefault: boolean;
  depositEnable: boolean;
  withdrawEnable: boolean;
  depositDesc: string;
  withdrawDesc: string;
  specialTips: string;
  specialWithdrawTips?: string;
  name: string;
  resetAddressStatus: boolean;
  addressRegex: string;
  addressRule: string;
  memoRegex?: string;
  withdrawFee: string;
  withdrawMin: string;
  withdrawMax: string;
  minConfirm: number;
  unLockConfirm: number;
  sameAddress: boolean;
  estimatedArrivalTime: number;
  busy: boolean;
  depositDeduct: boolean;
  needTag: boolean;
  tagName?: string;
  tagRegex?: string;
}

/**
 * Parameters for getAllCoins API
 */
export interface GetAllCoinsParams {
  recvWindow?: number;
}
