const log = console.log
const utils = require('./utils')
const pressAnyKey = require('press-any-key')
const web3 = utils.WEB3

const ora = require('ora')
const inquirer = require("inquirer")
const chalk = require("chalk")
const figlet = require("figlet")

/*
const showHeader = (text) => {
    console.clear()
    log(chalk.green('------------------------------------------------------------------------------------------------------'))
    log(chalk.green(figlet.textSync(text)))
    log(chalk.green('------------------------------------------------------------------------------------------------------\n'))
}
*/

const showHeader = async (token, text) => {
    console.clear()
    log(chalk.green('------------------------------------------------------------------------------------------------------------------------'))
    log(chalk.green(figlet.textSync(text)))
    log(chalk.green('------------------------------------------------------------------------------------------------------------------------'))

    let producedKW = chalk.yellow(await token.methods.producedKW().call(utils.OPTIONS))
    let consumedKW = chalk.yellow(await token.methods.consumedKW().call(utils.OPTIONS))

    log(`  produced kw: ${producedKW}  *** `, `consumed kw: ${consumedKW}`)

    log(chalk.green('------------------------------------------------------------------------------------------------------------------------\n'))
}


const questions = [
    utils.WHICH_ACCOUNT,
    {
        name: 'QTY',
        type: 'number',
        message: 'which quantity energy in kw/h is produced?',
        validate: (input) => {
            return Number.isInteger(input) ? true : 'the value must be an integer'
        },
        default: 5
    }
]

const run = async () => {
    const token = utils.createToken(utils.OPTIONS)
    await showHeader(token, 'Producer    module')

    let answers = await inquirer.prompt(questions)
    const private = utils.EXTRACT_PRIVATE_KEY(answers.ACCOUNT)
    const options = { from: answers.ACCOUNT, gas: utils.GAS }
    
    let isProducer = await token.methods.isProducer(answers.ACCOUNT).call(options)
    if (!isProducer) {
        log(chalk.red(`account ${answers.ACCOUNT} must be a producer`))
        process.exit(-1)
    }
    let tx = await utils.sendTransaction(token.methods.produce(answers.QTY), answers.ACCOUNT, private)
    log('status: ', tx.status, tx.transactionHash)
}

run()

