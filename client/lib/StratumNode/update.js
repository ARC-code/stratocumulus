module.exports = function (data) {
  // @StratumNode:update(data)
  //
  // Update node data and render.
  //
  // Parameters:
  //   data
  //     an object
  //

  if (!data) {
    throw new Error('Invalid node data object: ' + data)
  }

  if (!this.data) {
    this.data = data
  } else {
    this.data = Object.assign(this.data, data)
  }

  this.render()
}
