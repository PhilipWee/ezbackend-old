import chalk from 'chalk'

const logger = console

export default function initiate(options:any,pkg:any) {
    const welcomeMessage = 'EzBackend - An extensible backend optimised for the developer experience'
    logger.log(chalk.inverse(`\n ${welcomeMessage} \n`))
}  