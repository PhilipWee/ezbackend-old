import {Command} from 'commander'
import {sync as readPackageUpSync} from 'read-pkg-up'
import initiate from './cli/initiate.js'
// import { __dirname } from './helpers.js'
import { useEnv } from './helpers.js'
import {start} from './server/index.js'
// import {test} from './model/index.js'

useEnv("/.ezb/.env")

const pkg = readPackageUpSync({cwd:__dirname})?.packageJson

const program = new Command()

program
    .command('init')
    .description('Initialize ezbackend into your project.')
    .option('-f --force', 'Force add ezbackend')
    .action((options) => initiate(options,pkg))

program
    .command('start')
    .description('Start the EzBackend Locally')
    .action((options) => start(options))

// program
//     .command('test')
//     .description('Testing function for EzBackend')
//     .action(() => {test()})

program.parse(process.argv)