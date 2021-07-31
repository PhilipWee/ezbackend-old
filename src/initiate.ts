import chalk from "chalk";
import { ProjectType } from "./project-types.js";
import { isEzbInstalled } from "./detect.js";
import { readPackageJson } from "./js-package-manager/index.js";
import { JsPackageManagerFactory } from "./js-package-manager/JsPackageManagerFactory.js";
import { paddedLog } from "./helpers.js";
import { commandLog } from "./helpers.js";
import defaultGenerator from './generators/DEFAULT/index.js'

const logger = console;

export default function initiate(options: any, pkg: any) {
  const welcomeMessage =
    "EzBackend - An extensible backend optimised for the developer experience";
  logger.log(chalk.inverse(`\n ${welcomeMessage} \n`));

  let projectType;

  const ezbInstalled = isEzbInstalled(readPackageJson(), options.force);
  projectType = ezbInstalled
    ? ProjectType.ALREADY_HAS_EZB
    : ProjectType.DEFAULT;

  return installEzb(projectType);
}

const installEzb = (projectType: ProjectType) => {
  const runGenerator: () => Promise<void> = () => {
    switch (projectType) {
      case ProjectType.ALREADY_HAS_EZB:
        logger.log();
        paddedLog("EzBackend seems to already be available in this project");
        logger.log();
        return Promise.resolve();
      case ProjectType.DEFAULT:
        return defaultGenerator().then(
          commandLog("Adding EzBackend to your app")
        );
      default:
        paddedLog(
          `We could not detect your project type. (code: ${projectType}`
        );
        return Promise.resolve()
    }
  };

  return runGenerator().catch((ex) => {
    logger.error(`\n     ${chalk.red(ex.stack)}`);
    process.exit(1);
  });
};
