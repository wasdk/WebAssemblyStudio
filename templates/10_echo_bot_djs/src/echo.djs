const { Message } = require('@iceteachain/utils')

@contract class EchoBot {
    @pure botInfo = {
        name: 'Echo bot',
        description: 'It just echoes what you say, like a parrot.',
        stateAccess: 'none'
    }

    @pure oncommand() {
        return this.ontext('Start')
    }

    @pure ontext(content: string) {
        return Message.text(content).input('Say something').done()
    }
}