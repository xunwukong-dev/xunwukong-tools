import "dotenv/config";
import { BinanceClient } from "../src/index.js";

async function polWithdraw() {
  const client = new BinanceClient({
    apiKey: process.env.BINANCE_API_KEY!,
    secretKey: process.env.BINANCE_SECRET_KEY!,
  });

  try {
    const result = await client.withdraw({
      coin: "POL",
      // it is a random address
      address: "0xd16642a48f75877d2f0110adba7934da27470275",
      amount: "0.5",
    });

    console.log("✅ success！");
    console.log("order ID:", result.id);
  } catch (error) {
    console.error("❌ failed:", error.message);
  }
}

// 运行示例
polWithdraw();
