import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv-defaults";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export function useEnv(relativePath: string) {
  const envPath = path.join(process.cwd(), relativePath);
  //TODO: Figure out how to make this not have to exit the build directory
  const defaultPath = path.join(__dirname, "../src","server/serverDefault.env");

  dotenv.config({ path: envPath, defaults: defaultPath });
}
