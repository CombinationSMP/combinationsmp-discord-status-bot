import dotenv from "dotenv";
import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import { MinecraftServerListPing } from "minecraft-status";
import config from "./config.json";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const getStatus = async () => {
  return await MinecraftServerListPing.ping(undefined, config.serverIP);
};

const setPresence = async () => {
  if (!client.user) {
    return console.error("Failed to set presence! client.user is undefined.");
  }

  let state = "";

  try {
    const status = await getStatus();

    switch (status.players.online) {
      case 0:
        state = "0 Players Online :(";
        break;
      case 1:
        state = "1 Player Online";
        break;
      default:
        state = `${status.players.online} Players Online`;
        break;
    }
  } catch {
    state = "CombinationSMP Is Currently Offline";
  }

  client.user.setActivity({
    name: "CombinationSMP",
    state,
    url: config.website,
    type: ActivityType.Custom,
  });
};

client.on("ready", () => {
  setPresence();

  setInterval(setPresence, 1000 * 60 * 5);

  console.log("Ready");
});

client.login(process.env.DISCORD_TOKEN);
