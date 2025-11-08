import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { BinanceClient } from '../src/index.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAllCoinsExample() {
  const client = new BinanceClient({
    apiKey: process.env.BINANCE_API_KEY!,
    secretKey: process.env.BINANCE_SECRET_KEY!,
    baseURL: 'https://api.binance.com',
    recvWindow: 5000,
  });

  try {
    console.log('📡 Fetching all coins configuration...\n');
    const coins = await client.getAllCoins();
    console.log(`✅ Success! Found ${coins.length} coins\n`);
    writeFileSync(path.join(__dirname, 'coins.json'), JSON.stringify(coins, null, 2));
  } catch (error) {
    console.error('❌ Failed:', error instanceof Error ? error.message : String(error));
  }
}

// 运行示例
getAllCoinsExample();
