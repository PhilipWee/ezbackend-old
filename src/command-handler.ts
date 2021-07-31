import {Command} from 'commander'
import {readPackageUpSync} from 'read-pkg-up'


const pkg = readPackageUpSync({cwd:__dirname})?.packageJson

const program = new Command()

program
    .command('init')
    .description('Initialize ezbackend into your project.')
    .option('-f --force', 'Force add ezbackend')
    .action((options) => initiate(options))



const initiate = (options:any) => {
    console.log('hello world')
}

program.parse(process.argv)