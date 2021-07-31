import fse from "fs-extra";
import path from "path";
import { __dirname } from "../../helpers.js";
import { JsPackageManager } from "../js-package-manager/JsPackageManager.js";

export async function baseGenerator(packageManager: JsPackageManager) {
  const packageJson = packageManager.retrievePackageJson();
  //TODO: Think about a possible need for versioning dependencies for different project types
  packageManager.addDependencies({ packageJson: packageJson }, ["ezbackend"]);
  copyBoilerPlate();
}

export function copyBoilerPlate() {
  const boilerPlatePath = () => {
    //TODO: Update to suport different frameworks, etc
    //TODO: Make this not have to do some ridiculous relative pathing because of the compiled location
    const defaultPath = path.resolve(__dirname,'../../src/cli', `frameworks/common`);
    return defaultPath;
  };

  const targetPath = () => {
    return "./.ezb";
  };

  const destinationPath = targetPath();
  fse.copySync(boilerPlatePath(), destinationPath, { overwrite: true });
}
