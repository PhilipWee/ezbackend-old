import {Command} from 'commander'
import {readPackageUpSync} from 'read-pkg-up'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import initiate from './initiate.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = readPackageUpSync({cwd:__dirname})?.packageJson

const program = new Command()

program
    .command('init')
    .description('Initialize ezbackend into your project.')
    .option('-f --force', 'Force add ezbackend')
    .action((options) => initiate(options,pkg))

program.parse(process.argv)