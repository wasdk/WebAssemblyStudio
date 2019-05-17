const { SurveyBot, Message } = require('https://raw.githubusercontent.com/TradaTech/botutils/master/index.js')

const RATE = 5
const MAX = 6
const MAX_BET = 5

@contract class DiceBot extends SurveyBot {
    @pure getName() {
        return 'Dice Bot'
    }

    @pure getDescription() {
        return 'Play dice game.'
    }

    @pure getSteps() {
        return ['Starting','Number', 'Amount', 'Confirm']
    }

    succeedStarting() {
        const m = Message
        .text(`If you bet 1 TEA and guess the number correctly, I will transfer ${RATE} TEA back to you. `)
        .text('Pick your number.')
        .buttonRow()

        for (let i = 1; i <= MAX; i++) {
          m.button(String(i))
        }

        return m.endRow().done()
    }

    collectNumber(number, collector) {
        return collector.number = number
    }

    succeedNumber(number) {
      const max = this.#getMaxBet()
        return Message.text(`You picked ${number}.`)
            .text(`How much you want to bet (maximum ${max} TEA)?`)
            .input('Bet amount', {
              value: parseInt(max),
              sub_type: 'number'
            })
            .done() 
    }

    collectAmount(amount, collector) {
      amount = +amount
      if (amount <= 0 || amount > this.#getMaxBet()) {
        throw new Error('Invalid bet amount')
      }
        return collector.amount = +amount
    }

    failAmount(amount) {
      const max = this.#getMaxBet()
      return Message.text(`Invalid amount ${amount}. Please enter a valid amount (maximum ${max} TEA).`)
          .input('Bet amount', {
            value: parseInt(max),
            sub_type: 'number'
          })
          .done() 
    }

    succeedAmount(amount, collector) {
        return Message.html(`Your picked number: <b>${collector.number}</b><br>Your bet amount: <b>${amount}</b> TEA.`)
            .button('Confirm', 'confirm')
            .requestTransfer(amount)
            .done()
    }

    succeedConfirm(confirm, collector) {
      const r = this.#randomize()
      const win = (r === +collector.number)
      const receiveAmount = win ? msg.value * RATE : 0
      if (receiveAmount) {
        this.transfer(msg.sender, receiveAmount)
      }
      return Message.html(`DICE RESULT: <b>${r}</b><br>
        You guess: ${collector.number} => <b>YOU ${win ? 'WIN' : 'LOSE'}</b><br>
        You sent: <b>${msg.value}</b> TEA<br>
        You received: <b>${receiveAmount}</b> TEA.`)
        .button('Restart')
        .done() 
  }

  #randomize() {
    return parseInt(block.hash.substr(-16), 16) % MAX + 1
  }

  #getMaxBet() {
    return Math.min(this.balance / (RATE - 1), MAX_BET)
  }
    
}
