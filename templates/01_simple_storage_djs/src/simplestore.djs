const { validate } = require('./helper.js')

@contract
class NumberStore {
  @view @state value : number = 0

  @transaction setValue (value : number): number {
    const oldValue = this.value
    this.value = validate(value)
    this.emitEvent('ValueSet', { by: msg.sender, oldValue: oldValue, newValue: this.value }, ['by'])
    return value
  }
}