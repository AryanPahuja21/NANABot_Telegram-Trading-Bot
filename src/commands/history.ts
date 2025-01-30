import TelegramBot, { Message } from "node-telegram-bot-api";
import { User } from "../schemas/userSchema";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export const history = async (bot: TelegramBot, msg: Message) => {
  const userId = msg.from?.id;
  const chatId = msg.chat.id;
  const user = await User.findOne({ userId });

  if (!user) {
    return "🚨 You haven't registered a wallet yet! Use /register to create one.";
  }

  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    if (!user.publicKey) {
      return "🚨 Your wallet public key is missing. Please register again.";
    }
    const pubKey = new PublicKey(user.publicKey);

    const transactions = await connection.getSignaturesForAddress(pubKey, {
      limit: 5,
    });

    if (transactions.length === 0) {
      return "📭 No recent transactions found.";
    }

    let message = "📜 *Transaction History:*\n\n";
    transactions.forEach((tx, index) => {
      message += `🔹 *${
        index + 1
      }.* [View on Solana Explorer](https://explorer.solana.com/tx/${
        tx.signature
      }?cluster=devnet)\n`;
      message += `   - *Status:* ${tx.confirmationStatus}\n`;
      message += `   - *Date:* ${new Date(
        tx.blockTime! * 1000
      ).toLocaleString()}\n\n`;
    });

    return bot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Transaction History Error:", error);
    return "❌ Failed to fetch transaction history. Please try again.";
  }
};
