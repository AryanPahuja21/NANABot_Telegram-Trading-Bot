import TelegramBot, { Message } from "node-telegram-bot-api";

export const start = (bot: TelegramBot, msg: Message) => {
  const message = `
Welcome to NANAbot! 🚀

Your all-in-one assistant for managing your Solana wallet on the go! With this bot, you can:

💰 Check Balance: Instantly view your wallet's SOL balance.
💸 Send SOL: Securely transfer SOL tokens to any wallet address.
📜 View Wallet Address: Access your public wallet address.
📈 Transaction History: Keep track of your recent activities.

Designed with simplicity and security in mind, NANAbot makes it easier than ever to interact with the Solana blockchain 🌐
`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Get Started 🚀", callback_data: "get_started" }],
        [{ text: "Quick Guide 📖", callback_data: "quick_guide" }],
      ],
    },
  };
  bot.sendMessage(msg.chat.id, message, options);

  bot.on("callback_query", (callbackQuery) => {
    const chatId = callbackQuery.message?.chat.id || "";
    const data = callbackQuery.data;

    const getStartedMessage = `
Get Started 🚀

Create an account by typing /register to generate a new wallet address.
`;

    const quickGuidMessage = `
Quick Guide 📖  

1. To check your wallet balance, simply type /balance.
2. To send SOL tokens, type /send followed by the recipient's address and the amount.
3. To view your wallet address, type /address.
4. To view your transaction history, type /history.
5. To view all commands, type /help.
    `;

    if (data === "get_started") {
      bot.sendMessage(chatId, getStartedMessage);
    } else if (data === "quick_guide") {
      bot.sendMessage(chatId, quickGuidMessage);
    }

    bot.answerCallbackQuery(callbackQuery.id);
  });
};
