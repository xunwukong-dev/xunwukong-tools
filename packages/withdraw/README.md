# @xunwukong-tools/withdraw

币安提币工具 - 通过编程方式从币安提取代币。

## 目录

- [功能特性](#功能特性)
- [安装](#安装)
- [快速开始](#快速开始)
- [使用方法](#使用方法)
- [API 文档](#api-文档)
- [示例代码](#示例代码)
- [错误处理](#错误处理)
- [注意事项](#注意事项)
- [参考文档](#参考文档)

## 功能特性

- ✅ 支持所有币安支持的代币提币
- ✅ 支持查询所有币种配置信息（余额、网络、提现费用等）
- ✅ 支持自定义网络（ERC20, TRC20, BEP20 等）
- ✅ 支持地址标签（Address Tag）用于 XRP、XMR 等
- ✅ 支持现货钱包和资金钱包
- ✅ 完整的 TypeScript 类型支持
- ✅ 简单易用的编程 API

## 安装

### 使用 pnpm（推荐）

```bash
pnpm install @xunwukong-tools/withdraw
```

### 使用 npm

```bash
npm install @xunwukong-tools/withdraw
```

### 使用 yarn

```bash
yarn add @xunwukong-tools/withdraw
```

## 快速开始

```typescript
import { BinanceClient } from '@xunwukong-tools/withdraw';

const client = new BinanceClient({
  apiKey: BINANCE_API_KEY!,
  secretKey: BINANCE_SECRET_KEY!,
});

const result = await client.withdraw({
  coin: 'BTC',
  address: 'bc1q27jqf67tz9zyns50fcrqykmt9mk8u9hj8zqlpm',
  amount: '0.001',
  network: 'BTC',
});

console.log('Withdrawal ID:', result.id);
```


### 重要提示

- ✅ 确保你的 API 密钥有提币权限
- ✅ 不要在代码中硬编码密钥

## 使用方法

### 基本提币

```typescript
import { BinanceClient } from '@xunwukong-tools/withdraw';

const client = new BinanceClient({
  apiKey: BINANCE_API_KEY!,
  secretKey: BINANCE_SECRET_KEY!,
});

const result = await client.withdraw({
  coin: 'BTC',
  address: 'bc1q27jqf67tz9zyns50fcrqykmt9mk8u9hj8zqlpm',
  amount: '0.001',
  network: 'BTC',
  withdrawOrderId: 'my-withdrawal-001',
});

console.log('Withdrawal ID:', result.id);
```

### 使用 TRC20 网络提币 USDT

```typescript
const result = await client.withdraw({
  coin: 'USDT',
  address: 'TYourAddressHere',
  amount: '100',
  network: 'TRC20',
});
```

### 提币 XRP（需要地址标签）

```typescript
const result = await client.withdraw({
  coin: 'XRP',
  address: 'rYourAddressHere',
  amount: '10',
  addressTag: '123456',
});
```

### 完整参数示例

```typescript
const result = await client.withdraw({
  coin: 'BTC',
  address: 'bc1q27jqf67tz9zyns50fcrqykmt9mk8u9hj8zqlpm',
  amount: '0.001',
  network: 'BTC',
  withdrawOrderId: 'my-withdrawal-001',
  name: 'My Wallet',
  walletType: 0, // 0 = 现货钱包, 1 = 资金钱包
  recvWindow: 5000,
});
```

### 查询所有币种配置信息

在提币前，你可以先查询账户中所有币种的配置信息，包括余额、支持的网络、提现费用等：

```typescript
const coins = await client.getAllCoins();

// 查找特定币种（如 BTC）
const btc = coins.find((coin) => coin.coin === 'BTC');
if (btc) {
  console.log('BTC 余额:', btc.free);
  console.log('支持的网络:', btc.networkList.map((n) => n.network));
  
  // 查找默认网络
  const defaultNetwork = btc.networkList.find((n) => n.isDefault);
  if (defaultNetwork) {
    console.log('默认网络:', defaultNetwork.network);
    console.log('提现手续费:', defaultNetwork.withdrawFee);
    console.log('最小提现金额:', defaultNetwork.withdrawMin);
    console.log('最大提现金额:', defaultNetwork.withdrawMax);
  }
}

// 筛选可提现的币种
const withdrawableCoins = coins.filter((coin) => coin.withdrawAllEnable);
console.log('可提现币种数量:', withdrawableCoins.length);
```

## API 文档

### BinanceClient

币安提币客户端类。

#### 构造函数

```typescript
new BinanceClient(config: BinanceConfig)
```

**参数：**

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `apiKey` | `string` | ✅ | - | 币安 API Key |
| `secretKey` | `string` | ✅ | - | 币安 API Secret Key |
| `baseURL` | `string` | ❌ | `https://api.binance.com` | API 基础 URL |
| `recvWindow` | `number` | ❌ | `5000` | 接收窗口时间（毫秒） |

#### 方法

##### withdraw

发起提币请求。

```typescript
withdraw(params: WithdrawParams): Promise<WithdrawResponse>
```

**参数：**

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `coin` | `string` | ✅ | 代币符号（如 BTC, ETH, USDT） |
| `address` | `string` | ✅ | 提币地址 |
| `amount` | `string \| number` | ✅ | 提币数量 |
| `network` | `string` | ❌ | 网络类型（如 ERC20, TRC20, BEP20）。如果不指定，将使用该代币的默认网络 |
| `addressTag` | `string` | ❌ | 地址标签，用于 XRP、XMR 等需要二级地址标识的代币 |
| `withdrawOrderId` | `string` | ❌ | 客户端提币订单 ID，可用于后续查询 |
| `name` | `string` | ❌ | 地址描述，用于地址簿（最多 200 个地址） |
| `walletType` | `0 \| 1` | ❌ | 钱包类型，`0` 表示现货钱包，`1` 表示资金钱包。默认使用当前选中的钱包 |
| `transactionFeeFlag` | `boolean` | ❌ | 内部转账时，`true` 表示手续费返回到目标账户，`false` 表示返回到源账户（默认） |
| `recvWindow` | `number` | ❌ | 接收窗口时间（毫秒），默认使用构造函数中设置的值 |

**返回值：**

```typescript
Promise<WithdrawResponse>
```

`WithdrawResponse` 包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 提币订单 ID |

##### getAllCoins

获取账户中所有币种的配置信息，包括余额、支持的网络、提现费用等。

```typescript
getAllCoins(params?: GetAllCoinsParams): Promise<CoinConfig[]>
```

**参数：**

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `recvWindow` | `number` | ❌ | 接收窗口时间（毫秒），默认使用构造函数中设置的值 |

**返回值：**

```typescript
Promise<CoinConfig[]>
```

`CoinConfig` 包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| `coin` | `string` | 币种符号（如 BTC, ETH, USDT） |
| `name` | `string` | 币种名称 |
| `depositAllEnable` | `boolean` | 是否支持充值 |
| `withdrawAllEnable` | `boolean` | 是否支持提现 |
| `free` | `string` | 可用余额 |
| `locked` | `string` | 锁定余额 |
| `freeze` | `string` | 冻结余额 |
| `withdrawing` | `string` | 提现中的余额 |
| `trading` | `boolean` | 是否可交易 |
| `networkList` | `NetworkConfig[]` | 支持的网络列表 |

`NetworkConfig` 包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| `network` | `string` | 网络类型（如 BTC, ERC20, TRC20） |
| `name` | `string` | 网络名称 |
| `isDefault` | `boolean` | 是否为默认网络 |
| `depositEnable` | `boolean` | 是否支持充值 |
| `withdrawEnable` | `boolean` | 是否支持提现 |
| `withdrawFee` | `string` | 提现手续费 |
| `withdrawMin` | `string` | 最小提现金额 |
| `withdrawMax` | `string` | 最大提现金额 |
| `needTag` | `boolean` | 是否需要标签（memo/tag） |
| `tagName` | `string?` | 标签名称（如果需要） |
| `addressRegex` | `string` | 地址格式正则表达式 |
| `memoRegex` | `string?` | 标签格式正则表达式（如果需要） |

## 错误处理

API 调用可能会抛出错误，建议使用 try-catch 进行错误处理：

```typescript
try {
  const result = await client.withdraw({
    coin: 'BTC',
    address: 'bc1q27jqf67tz9zyns50fcrqykmt9mk8u9hj8zqlpm',
    amount: '0.001',
  });
  console.log('✅ 提币成功！');
  console.log('Withdrawal ID:', result.id);
} catch (error) {
  console.error('❌ 提币失败:', error instanceof Error ? error.message : error);
}
```

### 常见错误

请参考 [币安 API 错误代码文档](https://developers.binance.com/docs/binance-spot-api-docs/error-codes)。

## 示例代码

项目提供了多个示例文件，展示不同的使用场景。你可以在 `examples` 目录中找到这些示例。

### 运行示例

在运行示例前，请确保已配置 API 密钥（参考上面的[配置](#配置)部分）。

如果使用 `.env` 文件，示例会自动加载环境变量。如果使用环境变量，请先设置：

```bash
export BINANCE_API_KEY=your_api_key_here
export BINANCE_SECRET_KEY=your_secret_key_here
```

然后运行相应的示例：

```bash
# POL 提币示例
pnpm example:pol

# USDC POL 提币示例
pnpm example:usdc-pol

# 高级提币示例（包含所有可选参数）
pnpm example:advanced

# 查询所有币种配置信息示例
pnpm example:get-all-coins
```

### 示例文件说明

- `examples/pol.ts` - POL 代币提币示例
- `examples/usdc-pol.ts` - USDC POL 网络提币示例
- `examples/advanced.ts` - 高级示例，展示所有可选参数的使用
- `examples/get-all-coins.ts` - 查询所有币种配置信息示例，会将结果保存到 `coins.json` 文件

## 注意事项

### 网络选择

在提币前，建议先使用 `getAllCoins()` 方法查询代币支持的网络列表和默认网络。这样可以：

- ✅ 确认代币支持哪些网络
- ✅ 了解每个网络的提现手续费
- ✅ 查看最小和最大提现金额限制
- ✅ 确认是否需要地址标签（memo/tag）

示例：

```typescript
const coins = await client.getAllCoins();
const usdt = coins.find((coin) => coin.coin === 'USDT');
if (usdt) {
  // 查看 USDT 支持的网络
  usdt.networkList.forEach((network) => {
    console.log(`${network.network}: 手续费 ${network.withdrawFee}, 最小 ${network.withdrawMin}`);
  });
}
```

### 提币限额

提币前请确保：
- ✅ 账户有足够的余额
- ✅ 注意最小提币金额
- ✅ 了解提币手续费
- ✅ 检查每日提币限额

### 安全建议

- 🔒 使用 IP 白名单限制 API 访问
- 🔄 定期轮换 API 密钥
- 🚫 不要在代码中硬编码密钥
- 📝 使用环境变量管理密钥
- 🏢 在生产环境中使用安全的密钥管理服务（如 AWS Secrets Manager、Azure Key Vault 等）
- ✅ 仅授予必要的权限（只开启提币权限，不要开启交易权限）

## 参考文档

- [币安提币 API 文档](https://developers.binance.com/docs/wallet/capital/withdraw)
- [币安所有币种信息 API 文档](https://developers.binance.com/docs/wallet/capital/all-coins-information-user)
- [币安 API 错误代码](https://developers.binance.com/docs/binance-spot-api-docs/error-codes)
- [币安 API 安全最佳实践](https://developers.binance.com/docs/wallet/security)

## License

MIT
