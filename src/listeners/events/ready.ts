import { type Client, Events, Routes } from "discord.js";
import { commands } from "utils/listeners";
import { log } from "utils/logger";

export const data = Events.ClientReady;

export const action: Action<Client<true>> = async ({ rest, user }) => {
  try {
    await rest.put(Routes.applicationCommands(user.id), {
      body: commands.map(([data]) => data.toJSON()),
    });
    log.info(`Logged in as "${user.tag}"`);
  } catch (err) {
    log.fatal("There was an error uploading commands to Discord API");
    console.error(err);
    return false;
  }

  return true;
};
