import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

import { start } from "./commands/start";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => start(bot, msg));
