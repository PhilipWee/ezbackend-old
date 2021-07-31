import chalk from "chalk";
import { ProjectType } from "./project-types.js";
import { isEzbInstalled } from "./detect.js";
import { readPackageJson } from "./js-package-manager";

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
  logger.log(projectType);

  return installEzb(projectType);
}

const installEzb = (projectType:ProjectType) => {
    console.log('Installing')
}