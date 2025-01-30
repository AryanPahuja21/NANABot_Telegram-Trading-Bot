import TelegramBot, { Message } from "node-telegram-bot-api";
import { User } from "../schemas/userSchema";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export const send = async (
  bot: TelegramBot,
  msg: Message,
  match: RegExpExecArray | null
) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;

  const recipientAddress = match?.[1];
  const amountStr = match?.[2];

  if (!recipientAddress || !amountStr) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Invalid command usage!*\n\n" +
        "✅ *Correct Format:* `/send <Recipient Address> <Amount>`\n" +
        "💡 Example: `/send 4v3bL9Yx... 0.5`",
      { parse_mode: "Markdown" }
    );
  }

  const amountSOL = parseFloat(amountStr);
  if (isNaN(amountSOL) || amountSOL <= 0) {
    return bot.sendMessage(
      chatId,
      "❌ Invalid amount. Please enter a positive number."
    );
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return bot.sendMessage(
      chatId,
      "🚨 You haven't registered a wallet yet! Use /register to create one."
    );
  }

  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    if (!user.privateKey) {
      return bot.sendMessage(
        chatId,
        "❌ Private key is missing. Please register again."
      );
    }
    const senderKeypair = Keypair.fromSecretKey(
      new Uint8Array(Buffer.from(user.privateKey, "hex"))
    );
    const recipientPublicKey = new PublicKey(recipientAddress);

    const lamports = amountSOL * 1_000_000_000;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      senderKeypair,
    ]);

    bot.sendMessage(
      chatId,
      `✅ *Transaction Successful!*\n\n📤 Sent *${amountSOL} SOL* to \`${recipientAddress}\`.\n🔗 [View Transaction](https://explorer.solana.com/tx/${signature}?cluster=devnet)`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Error sending SOL:", error);
    bot.sendMessage(
      chatId,
      "❌ Transaction failed. Please check the address and balance, then try again."
    );
  }
};
