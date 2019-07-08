const { validate } = require('./helper.js')

@contract
class NumberStore {
  @view @state value : number = 0

  @transaction setValue (value,v1,v2,v3,v4) {
    const oldValue = this.value
    this.value = validate(value)
    this.emitEvent('ValueSet', { by: msg.sender, oldValue: oldValue, newValue: this.value }, ['by'])
    return oldValue
  }
}