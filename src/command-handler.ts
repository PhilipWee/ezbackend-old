import {Command} from 'commander'
import {readPackageUpSync} from 'read-pkg-up'
import initiate from './cli/initiate.js'
import { __dirname } from './cli/helpers.js'


const pkg = readPackageUpSync({cwd:__dirname})?.packageJson

const program = new Command()

program
    .command('init')
    .description('Initialize ezbackend into your project.')
    .option('-f --force', 'Force add ezbackend')
    .action((options) => initiate(options,pkg))

program.parse(process.argv)