import path from "path";
import dotenv from "dotenv-defaults";

export function useEnv(relativePath: string) {
  const envPath = path.join(process.cwd(), relativePath);
  //TODO: Figure out how to make this not have to exit the build directory
  const defaultPath = path.join(__dirname, "../src","server/serverDefault.env");

  dotenv.config({ path: envPath, defaults: defaultPath });
}
