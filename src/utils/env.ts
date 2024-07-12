import { z } from "zod";

export const envVariables = z.object({
  DISCORD_TOKEN: z.string(),
  NODE_ENV: z.enum(["production", "development"]).optional(),
});
