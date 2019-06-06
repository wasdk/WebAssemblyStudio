const { SurveyBot, Message, utils } = require('@iceteachain/utils')
const Big = require('big.js')

const DiceTypes = [{
    rate: 5,
    sides: 6,
    maxBet: 5000000n
}, {
    rate: 1.8,
    sides: 2,
    maxBet: 5000000n
}]

@contract class DiceBot extends SurveyBot {

    diceType = 0
    dice = (diceType = this.diceType || 0) => DiceTypes[diceType]

    @pure getName() {
        return 'Dice Bot'
    }

    @pure getDescription() {
        return 'Play dice game.'
    }

    @pure getCommands() {
        return [
            { text: 'Restart', value: 'start' },
            { text: 'Dice (6 sides)', value: 'dice6' },
            { text: 'Dice (2 sides)', value: 'dice2' },
            { text: 'Help', value: 'help' },
        ]
    }

    getSteps() {
        return [
            {
                name: 'intro',
                nextStateAccess: 'read' // need to get balance for getMaxBet
            },
            {
                name: 'number',
                nextStateAccess: 'read',
            },
            'amount',
            'confirm'
        ]
    }

    makeSendback(addr, chat) {
        const sendback = super.makeSendback(addr, chat)
        sendback.diceType = this.diceType
        return sendback
    }

    oncommand_dice6() {
        this.diceType = 0
        return this.start()
    }

    oncommand_dice2() {
        this.diceType = 1
        return this.start()
    }

    oncommand_help() {
        const s = this.getStep(msg.sender)
        let t
        switch (s) {
            case 0:
                t = 'Just click Start button, don\'t worry.'
                break
            case 1:
                t = 'Pick a number, any number.'
                break
            case 2:
                t = 'The amount of tea you want to bet.'
                break
            case 3:
                t = 'Just confirm the transfer.'
                break
            default:
                t = 'Select a number and bet. It is easy!'
                break
        }
        return Message.html(t, { cssClass: 'bot-help' }).done()
    }

    succeed_intro() {
        const m = Message
            .text(`If you bet 1 TEA and guess the number correctly, I will transfer ${this.dice().rate} TEA back to you. `)
            .text('Pick your number.')
            .buttonRow()
        const sides = this.dice().sides
        for (let i = 1; i <= sides; i++) {
            m.button(String(i))
        }

        return m.endRow().done()
    }

    collect_number(number, collector) {
        return collector.number = number
    }

    succeed_number(number) {
        const max = this.getMaxBet()
        const tea = utils.toStandardUnit(max)
        return Message.text(`You picked ${number}.`)
            .text(`How much you want to bet(maximum ${tea} TEA) ? `)
            .input('Bet amount', {
                value: tea,
                sub_type: 'text'
            })
            .done()
    }

    collect_amount(amount, collector) {
        amount = utils.toMicroUnit(+amount)
        if (amount <= 0 || amount > this.getMaxBet()) {
            throw new Error('Invalid bet amount')
        }
        return collector.amount = +amount
    }

    fail_amount(amount) {
        const max = this.getMaxBet()
        const tea = utils.toStandardUnit(max)
        return Message.text(`Invalid amount ${amount}.Please enter a valid amount(maximum ${tea} TEA).`)
            .input('Bet amount', {
                value: tea,
                sub_type: 'text'
            })
            .done()
    }

    succeed_amount(amount, collector) {
        const tea = utils.toStandardUnit(amount)
        return Message.html(`Your picked number: <b>${collector.number}</b> <br>Your bet amount: <b>${tea}</b> TEA.`)
            .button('Confirm', 'confirm')
            .requestTransfer(amount)
            .done()
    }

    succeed_confirm(confirm, collector) {
        const r = this.randomize()
        const win = (r === +collector.number)
        const receiveAmount = win ? BigInt(new Big(msg.value.toString()).times(this.dice().rate)) : 0n
        if (receiveAmount) {
            this.transfer(msg.sender, receiveAmount)
        }
        return Message.html(`DICE RESULT: <b>${r}</b><br>
        You guess: ${collector.number} => <b>YOU ${win ? 'WIN' : 'LOSE'}</b><br>
            You sent: <b>${utils.toStandardUnit(msg.value)}</b> TEA<br>
                You received: <b>${utils.toStandardUnit(receiveAmount)}</b> TEA.`)
            .button('Play Again', 'start')
            .done()
    }

    @pure randomize(diceType) {
        return parseInt(block.hash.substr(-16), 16) % this.dice(diceType).sides + 1
    }

    @view getMaxBet(diceType) {
        const { rate, maxBet } = this.dice(diceType)
        const afforable = BigInt(new Big(this.balance.toString()).div(rate - 1).toString())
        return afforable > maxBet ? maxBet : afforable
    }
}
