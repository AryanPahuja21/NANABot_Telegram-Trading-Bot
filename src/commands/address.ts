import TelegramBot, { Message } from "node-telegram-bot-api";
import { User } from "../schemas/userSchema";

export const address = async (bot: TelegramBot, msg: Message) => {
  const userId = msg.from?.id;

  const user = await User.findOne({ userId });

  if (!user) {
    return bot.sendMessage(
      msg.chat.id,
      "🚨 You haven't registered a wallet yet! Use /register to create one."
    );
  }

  bot.sendMessage(
    msg.chat.id,
    `🔑 *Your Wallet Address:* \`${user.publicKey}\``,
    { parse_mode: "Markdown" }
  );
};
