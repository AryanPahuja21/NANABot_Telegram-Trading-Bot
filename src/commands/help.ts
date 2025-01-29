import TelegramBot, { Message } from "node-telegram-bot-api";

export const help = async (bot: TelegramBot, msg: Message) => {
  const message = `
🤖 *Available Commands* 🤖

1. To check your wallet balance, simply type /balance.
2. To send SOL tokens, type /send followed by the recipient's address and the amount.
3. To view your wallet address, type /address.
4. To sign transactions, type /sign followed by the transaction message.
5. To view your transaction history, type /history.
    `;
  bot.sendMessage(msg.chat.id, message, { parse_mode: "Markdown" });
};
