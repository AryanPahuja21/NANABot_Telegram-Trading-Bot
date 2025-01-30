import TelegramBot, { Message } from "node-telegram-bot-api";
import { User } from "../schemas/userSchema";
import { Keypair } from "@solana/web3.js";
import { encryptPrivateKey } from "../utils/cryptoUtils";

export const register = async (bot: TelegramBot, msg: Message) => {
  const userId = msg.from?.id;

  const existingUser = await User.findOne({
    userId,
  });

  if (existingUser) {
    return bot.sendMessage(
      msg.chat.id,
      `You are already registered! Your wallet address is: \n\`${existingUser.publicKey}\`

Type /help to get a quick overview of the commands.
    `,
      { parse_mode: "Markdown" }
    );
  }

  const keypair = Keypair.generate();

  const encryptedPrivateKey = encryptPrivateKey(
    Buffer.from(keypair.secretKey).toString("hex")
  );

  await User.create({
    userId,
    publicKey: keypair.publicKey.toBase58(),
    privateKey: encryptedPrivateKey,
  });

  bot.sendMessage(
    msg.chat.id,
    `✅ *Registration Successful!* \n\n🔹 *Your Solana Wallet Address:* \n\`${keypair.publicKey.toBase58()}\` \n\n🔑 *Your Private Key is stored securely.*`,
    { parse_mode: "Markdown" }
  );
};
