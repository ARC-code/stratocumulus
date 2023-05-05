module.exports = (interaction) => {
  return function (ev) {
    // This is keydown event handler
    //

    // Choose direction.
    // Use ev.key instead of ev.code to depend on key character
    // instead of physical position.
    let factor = 1
    switch (ev.key) {
      case '+':
        factor = 1 / 1.5
        break
      case '-':
        factor = 1.5
        break
      default:
        break
    }

    if (factor !== 1) {
      interaction.target.scaleBy(factor)
      interaction.source.emit('keyzoom')
    }
  }
}
