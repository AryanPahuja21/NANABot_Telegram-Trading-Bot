import TelegramBot, { Message } from "node-telegram-bot-api";
import { User } from "../schemas/userSchema";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export const balance = async (bot: TelegramBot, msg: Message) => {
  const userId = msg.from?.id;

  const user = await User.findOne({ userId });

  if (!user) {
    return bot.sendMessage(
      msg.chat.id,
      "🚨 You haven't registered a wallet yet! Use /register to create one."
    );
  }

  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    if (!user.publicKey) {
      return bot.sendMessage(
        msg.chat.id,
        "🚨 Your wallet public key is missing. Please register again."
      );
    }
    const publicKey = new PublicKey(user.publicKey);
    const balanceLamports = await connection.getBalance(publicKey);
    const balanceSOL = balanceLamports / 1_000_000_000;

    bot.sendMessage(
      msg.chat.id,
      `💰 *Your SOL Balance:* \`${balanceSOL.toFixed(6)} SOL\``,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Error fetching balance:", error);
    bot.sendMessage(
      msg.chat.id,
      "❌ Failed to fetch balance. Please try again later."
    );
  }
};
