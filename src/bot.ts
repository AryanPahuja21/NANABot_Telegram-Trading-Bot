import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

import { start } from "./commands/start";
import connectDB from "./config/db";
import { register } from "./commands/register";
import { help } from "./commands/help";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(token, { polling: true });

(async () => {
  try {
    await connectDB();
    console.log("Database connected successfully!!");
  } catch (error) {
    console.error("Failed to connect database:", error);
    process.exit(1);
  }
})();

bot.onText(/\/start/, (msg) => start(bot, msg));
bot.onText(/\/register/, (msg) => register(bot, msg));
bot.onText(/\/help/, (msg) => help(bot, msg));
