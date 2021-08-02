import {sync as spawnSync} from 'cross-spawn'
import {sync as findUpSync} from 'find-up'
//TODO: Figure out why all the other packages can compile without js
import { Yarn1Proxy } from './Yarn1Proxy'

export class JsPackageManagerFactory {
    public static getPackageManager() {
        const yarnVersion = getYarnVersion()
        const hasYarnLockFile = findUpSync('yarn.lock')

        const hasNPMCommand = hasNPM()

        //TODO: Add in support for Yarn 2 and npm. Refer to https://github.com/storybookjs/storybook/tree/next/lib/cli/src/js-package-manager
        if (yarnVersion && (hasYarnLockFile || !hasNPMCommand)) {
            if (yarnVersion === 1) {
                return new Yarn1Proxy()
            }
        }

        if (hasNPMCommand) {
            
        }

        throw new Error('Currently only supports Yarn, please use Yarn 1 for your project')
    }
}

function hasNPM() {
    const npmVersionCommand = spawnSync('npm', ['--version']);
    return npmVersionCommand.status === 0;
  }
  
  function getYarnVersion(): 1 | 2 | undefined {
    const yarnVersionCommand = spawnSync('yarn', ['--version']);
  
    if (yarnVersionCommand.status !== 0) {
      return undefined;
    }
  
    const yarnVersion = yarnVersionCommand.output.toString().replace(/,/g, '').replace(/"/g, '');
  
    return /^1\.+/.test(yarnVersion) ? 1 : 2;
  }
  