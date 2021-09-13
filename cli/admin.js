const log = console.log
const utils = require('./utils')
const pressAnyKey = require('press-any-key')
const web3 = utils.WEB3

const ora = require('ora')
const inquirer = require("inquirer")
const chalk = require("chalk")
const figlet = require("figlet")

const showHeader = async (token, text) => {
    console.clear()
    log(chalk.green('------------------------------------------------------------------------------------------------------------------------'))
    log(chalk.green(figlet.textSync(text)))
    log(chalk.green('------------------------------------------------------------------------------------------------------------------------'))
    let producedPrice = chalk.yellow(web3.utils.fromWei(await token.methods.getproducedPriceKWh().call(utils.OPTIONS), 'ether'))
    let consumedPrice = chalk.yellow(web3.utils.fromWei(await token.methods.getconsumedPriceKWh().call(utils.OPTIONS), 'ether'))
    let producedKW = chalk.yellow(await token.methods.producedKW().call(utils.OPTIONS))
    let consumedKW = chalk.yellow(await token.methods.consumedKW().call(utils.OPTIONS))
    log(`price of the produced kw/h: ${producedPrice} ETB ***`, `price of the consumed kw/h: ${consumedPrice} ETB ***`, `produced kw: ${producedKW}`, `consumed kw: ${consumedKW}`)

    log(chalk.green('------------------------------------------------------------------------------------------------------------------------\n'))
}

const list_role = {
    name: 'ROLE',
    type: 'list',
    message: 'Which role ?',
    choices: [{ name: 'admin', value: 0 }, { name: 'producer', value: 1 }, { name: 'consumer', value: 2 }],
}


const questions_create = [
    utils.WHICH_ACCOUNT,
    list_role
]

const add_account = async (token) => {
    let method

    let answers = await inquirer.prompt(questions_create)

    switch (answers.ROLE) {
        case 0:
            method = token.methods.addAdmin(answers.ACCOUNT)
            break;
        case 1:
            method = token.methods.addProducer(answers.ACCOUNT)
            break;
        case 2:
            method = token.methods.addConsumer(answers.ACCOUNT)
            break;
        default:
            throw "role not exists";
    }
    const spinner = ora(`Granting account ${answers.ACCOUNT}`).start()
    let tx = await utils.sendTransaction(method, utils.PUBLIC_KEY, utils.PRIVATE_KEY)
    if (tx.status) {
        spinner.succeed(`account granted ${answers.ACCOUNT} with success`)
    } else {
        spinner.fail(`fail to grant account ${answers.ACCOUNT}`)
    }
}


const roleAccount = async (token, account) => {
    return [
        { index: 0, name: 'admin', autorized: await token.methods.isAdmin(account).call(utils.OPTIONS) },
        { index: 1, name: 'producer', autorized: await token.methods.isProducer(account).call(utils.OPTIONS) },
        { index: 2, name: 'consumer', autorized: await token.methods.isConsumer(account).call(utils.OPTIONS) }
    ]
}

const remove_account = async (token) => {
    let choices = [], method
    let answers = await inquirer.prompt(utils.WHICH_ACCOUNT)
    let account = answers.ACCOUNT

    let roles = await roleAccount(token, account)
    roles.map(item => {
        if (item.autorized) {
            choices.push({ name: item.name, value: item.index })
        }
    })

    if (choices.length > 0) {

        answers = await inquirer.prompt({
            name: 'ROLE',
            type: 'list',
            message: 'Which role ?',
            choices: choices,
        })

        switch (answers.ROLE) {
            case 0:
                method = token.methods.removeAdmin(account)
                break;
            case 1:
                method = token.methods.removeProducer(account)
                break;
            case 2:
                method = token.methods.removeConsumer(account)
                break;
            default:
                throw "role not exists";
        }
        const spinner = ora(`Removing account ${account}`).start()
        let tx = await utils.sendTransaction(method, utils.PUBLIC_KEY, utils.PRIVATE_KEY)
        if (tx.status) {
            spinner.succeed(`role removed ${account} with success`)
        } else {
            spinner.fail(`fail to remove role ${account}`)
        }
    } else {
        log(chalk.red(`no role for the account ${account}`))
    }
}

const check_account = async (token) => {
    let answers = await inquirer.prompt(utils.WHICH_ACCOUNT)
    let roles = await roleAccount(token, answers.ACCOUNT)

    roles.map(role => {
        log(`\t${role.name} role`, role.autorized ? chalk.green('✔') : chalk.red('✖'))
    })

}

const main_menu = {
    name: 'MENU',
    type: 'list',
    message: 'Which operation ?',
    choices: [
        { name: 'Add an account', value: 0, action: add_account },
        { name: 'Remove an account', value: 1, action: remove_account },
        { name: 'Check an account', value: 2, action: check_account },
        { name: 'Exit', value: 3, action: null }
    ]
}

const run = async () => {
    var end = false, answers
    const token = utils.createToken()

    while (!end) {
        await showHeader(token, 'Admin    module')
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
