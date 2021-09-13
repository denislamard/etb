const log = console.log
const utils = require('./utils')
const pressAnyKey = require('press-any-key')
const web3 = utils.WEB3

const ora = require('ora')
const inquirer = require("inquirer")
const chalk = require("chalk")
const figlet = require("figlet")


const info_account = async (token) => {
    let answers = await inquirer.prompt(questions_info_account)

    let balance = web3.utils.fromWei(await token.methods.balanceOf(answers.ACCOUNT).call(utils.OPTIONS), 'ether')
    log('  balance of:\t\t\t', chalk.green(balance), 'ETB (Energy Token on blockchain)')

    let allowance = web3.utils.fromWei(await token.methods.allowance(answers.ACCOUNT, utils.CONTRACT).call(utils.OPTIONS), 'ether')
    log('  transferable amount:\t\t', chalk.green(allowance), 'ETB (Energy Token on blockchain)')
}

const set_amount = async (token) => {
    let answers = await inquirer.prompt(questions_set_amount)
    const private = utils.EXTRACT_PRIVATE_KEY(answers.ACCOUNT)
    let tx = await utils.sendTransaction(token.methods.approve(utils.CONTRACT, web3.utils.toWei((answers.AMOUNT).toString(), 'ether')), answers.ACCOUNT, private)
    log('status of the transaction:', tx.status)
}

const buy_token = async (token) => {
    let answers = await inquirer.prompt(questions_buy_token)
    let tx = await utils.sendTransaction(token.methods.buyToken(answers.ACCOUNT, web3.utils.toWei((answers.AMOUNT).toString(), 'ether')), utils.PUBLIC_KEY, utils.PRIVATE_KEY)
    log('status of the transaction:', tx.status)
}

const showHeader = async (token, text) => {
    console.clear()
    log(chalk.green('------------------------------------------------------------------------------------------------------'))
    log(chalk.green(figlet.textSync(text)))
    log(chalk.green('------------------------------------------------------------------------------------------------------'))
    let totalSupply = web3.utils.fromWei(await token.methods.totalSupply().call(utils.OPTIONS), 'ether')
    log('\t\ttotal Supply:\t\t', chalk.yellow(totalSupply), 'ETB (Energy Token on blockchain)')

    let available = web3.utils.fromWei(await token.methods.balanceOf(utils.CONTRACT).call(utils.OPTIONS), 'ether')
    log('\t\ttokens available:\t', chalk.yellow(available), 'ETB (Energy Token on blockchain)')

    log(chalk.green('------------------------------------------------------------------------------------------------------\n'))
}

const main_menu = {
    name: 'MENU',
    type: 'list',
    message: 'Which operation ?',
    choices: [
        { name: 'Info account', value: 0, action: info_account },
        { name: 'approve amount of tokens', value: 1, action: set_amount },
        { name: 'buy amount amount of tokens', value: 2, action: buy_token },
        { name: 'Exit', value: 3, action: null }
    ]
}

const questions_info_account = [
    utils.WHICH_ACCOUNT
]

const questions_set_amount = [
    utils.WHICH_ACCOUNT,
    {
        name: 'AMOUNT',
        type: 'number',
        message: 'amount of tokens approved?',
        validate: (input) => {
            return Number.isInteger(input) ? true : 'the value must be an integer'
        },
        default: 5
    }
]

const questions_buy_token = [
    utils.WHICH_ACCOUNT,
    {
        name: 'AMOUNT',
        type: 'number',
        message: 'amount of tokens?',
        validate: (input) => {
            return Number.isInteger(input) ? true : 'the value must be an integer'
        },
        default: 5
    }
]

const run = async () => {
    var end = false, answers
    const token = utils.createToken()

    while (!end) {
        await showHeader(token, 'Account   manager')
        answers = await inquirer.prompt(main_menu)
        if (answers.MENU == main_menu.choices.length - 1) {
            end = true
        } else {
            await main_menu.choices[answers.MENU].action(token)
        }
        if (!end) await pressAnyKey()
    }
}

run()