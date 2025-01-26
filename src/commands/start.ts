import TelegramBot, { Message } from "node-telegram-bot-api";

export const start = (bot: TelegramBot, msg: Message) => {
  const message = `
Welcome to NANAbot! 🚀

Your all-in-one assistant for managing your Solana wallet on the go! With this bot, you can:

💰 Check Balance: Instantly view your wallet's SOL balance.
💸 Send SOL: Securely transfer SOL tokens to any wallet address.
📜 View Wallet Address: Access your public wallet address.
🔒 Sign Transactions: Authorize transactions directly from the bot.
📈 Transaction History: Keep track of your recent activities.

Designed with simplicity and security in mind, NANAbot makes it easier than ever to interact with the Solana blockchain 🌐
`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Check Balance 💰", callback_data: "check_balance" }],
      ],
    },
  };
  bot.sendMessage(msg.chat.id, message, options);

  bot.on("callback_query", (callbackQuery) => {
    const chatId = callbackQuery.message?.chat.id || "";
    const data = callbackQuery.data;

    if (data === "check_balance") {
      bot.sendMessage(chatId, "Your current balance is 0.05 BTC.");
    }

    bot.answerCallbackQuery(callbackQuery.id);
  });
};
