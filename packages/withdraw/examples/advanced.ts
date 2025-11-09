import "dotenv/config";
import { BinanceClient } from "../src/index.js";

async function advancedWithdraw() {
  const client = new BinanceClient({
    apiKey: process.env.BINANCE_API_KEY!,
    secretKey: process.env.BINANCE_SECRET_KEY!,
    baseURL: "https://api.binance.com",
    recvWindow: 5000,
  });

  try {
    const result = await client.withdraw({
      coin: "BTC",
      // it is a random address
      address: "bc1q27jqf67tz9zyns50fcrqykmt9mk8u9hj8zqlpm",
      amount: "0.001",
      network: "BTC",
      withdrawOrderId: `advanced-${Date.now()}`,
      name: "My Wallet",
      walletType: 0,
      transactionFeeFlag: false,
      recvWindow: 5000,
    });

    console.log("✅ success");
    console.log("order ID:", result.id);
  } catch (error) {
    console.error("❌ failed:", error.message);
  }
}

// 运行示例
advancedWithdraw();
