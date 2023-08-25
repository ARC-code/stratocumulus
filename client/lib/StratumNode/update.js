module.exports = function (data) {
  // @StratumNode:update(data)
  //
  // Update node data and render.
  //
  // Parameters:
  //   data
  //     an object
  //

  this.data = Object.assign(this.data, data)

  this.render()
}
