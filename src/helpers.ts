import path from "path";
import dotenv from "dotenv-defaults";

export function useEnv(relativePath: string) {
  const envPath = path.join(process.cwd(), relativePath);
  const defaultPath = path.join(__dirname,"../src", "server/default.env");

  dotenv.config({ path: envPath, defaults: defaultPath });
}

//TODO: Figure if this relative path is really needed (Or can we put it directly in the function?)
export function useConfig(relativePath: string) {
  const configPath = path.join(process.cwd(), relativePath)
  //TODO: Consider if we want to use the compiled version or the uncompiled one
  const defaultPath = path.join(__dirname,"server/default.ezb.config.js")
  try {
    return require(configPath).default
  } catch (e) {
    //@ts-ignore
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      return require(defaultPath).default
  }
}
}