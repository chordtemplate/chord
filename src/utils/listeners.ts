import { join } from "node:path";
import {
  type Client,
  Collection,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from "discord.js";
import fg from "fast-glob";
import { log } from "utils/logger";

export const commands = new Collection<
  string,
  [Exclude<ClientEvent["data"], string>, ClientEvent["action"]]
>();

export async function setListeners(client: Client): Promise<void> {
  const files = await fg([join(process.cwd(), "src/listeners/**/*.ts")]);

  for (const file of files) {
    const { data, action } = (await import(file)) as ClientEvent;

    const isSlashCommand = data instanceof SlashCommandBuilder;
    const isContextCommand = data instanceof ContextMenuCommandBuilder;

    if (typeof data !== "string" && !isSlashCommand && !isContextCommand) {
      throw new TypeError(
        `Command at "${file}" is missing or is not correctly exporting the "data" listener property`,
      );
    }

    if (typeof action !== "function") {
      throw new TypeError(
        `Command at "${file}" is missing or is not correctly exporting the "action" function`,
      );
    }

    if (isSlashCommand || isContextCommand) {
      commands.set(data.name, [data, action]);
      continue;
    }

    client.on(data, async (event: unknown) => {
      try {
        const success = await action(event);

        if (success === false) {
          log.warn(
            `Error was caught at event on file "${file}", this is normal behaviour most of the time, but worth checking`,
          );
        } else if (success === true) {
          log.success(`Event on file "${file}" executed successfully!`);
        }
      } catch (err) {
        log.fatal(`Uncaught error at event on file "${file}"`);
        console.error(err);
      }
    });
  }
}
