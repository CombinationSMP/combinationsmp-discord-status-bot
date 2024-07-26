import dotenv from "dotenv";
import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import { MinecraftServerListPing } from "minecraft-status";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let lastFetched: number = -Infinity;
let lastFetchedValue: Status;

const getCachedStatus = async () => {
  if (lastFetched + 1000 * 60 * 5 > Date.now()) {
    return lastFetchedValue;
  }
  lastFetched = Date.now();
  return (lastFetchedValue = await MinecraftServerListPing.ping(
    undefined,
    process.env.SERVER_IP!,
    process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : undefined
  ));
};

const getStatusText = async () => {
  let statusText = "";

  try {
    const status = await getCachedStatus();

    switch (status.players.online) {
      case 0:
        statusText = "✧.· ･ﾟ 0 Players Online :(";
        break;
      case 1:
        statusText = "✧.· ･ﾟ 1 Player Online";
        break;
      default:
        statusText = `✧.· ･ﾟ ${status.players.online} Players Online`;
        break;
    }
  } catch {
    statusText = "✧.· ･ﾟ Currently Offline";
  }

  return statusText;
};

const setPresence = async () => {
  if (!client.user) {
    return console.error("Failed to set presence! client.user is undefined.");
  }

  const statusText = await getStatusText();

  client.user.setActivity({
    name: "CombinationSMP",
    state: statusText,
    url: process.env.WEBSITE,
    type: ActivityType.Custom,
  });
};

const setChannel = async () => {
  if (!process.env.DISCORD_GUILD_ID || !process.env.PLAYER_COUNT_CHANNEL_ID) {
    return console.error("Invalid .env! Missing info for status channels.");
  }

  const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
  if (!guild) {
    return console.error("Guild ID is invalid!");
  }
  const playerCountChannel = await guild.channels.fetch(process.env.PLAYER_COUNT_CHANNEL_ID);
  if (!playerCountChannel) {
    return console.error("Channel ID is invalid!");
  }

  const statusText = await getStatusText();

  playerCountChannel.setName(statusText);
};

client.on("ready", () => {
  setPresence();
  setChannel();

  setInterval(setPresence, 1000 * 60 * 5);
  setInterval(setPresence, 1000 * 60 * 5);

  console.log("Ready");
});

client.login(process.env.DISCORD_TOKEN);
