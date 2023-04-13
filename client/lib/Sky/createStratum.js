const stratumLib = require('./stratum')

module.exports = function (path, context, label, bgColor, position) {
  // Create and start one stratum.
  //
  // Parameters:
  //   path
  //     string, identifies the stratum
  //   context
  //     object
  //   label
  //     string, label for the root node
  //   bgColor
  //     string, css color for the root node
  //   position
  //     tapspace Point, the position of the root node.
  //
  // Return:
  //   a stratum. If a stratum with the path already exists, the existing
  //   one is returned.
  //

  // Ensure we do not create duplicate strata.
  if (this.strata[path]) {
    console.warn('Attempted to recreate existing stratum: ' + path)
    return this.strata[path]
  }

  // Build and render
  const stratum = stratumLib.build(path, context, label, bgColor)

  // Place into space DOM. Stratum (0,0,0) will match with the position.
  // TODO use FractalLoader for placing the content.
  this.space.addChild(stratum.space, position)

  // Keep track of what strata we have built.
  this.strata[path] = stratum
  this.strataTrail.push(stratum.path)
  this.currentStratum = this.strataTrail.length - 1

  stratum.on('stratumrequest', (ev) => {
    // This event tells us that an interaction within the stratum
    // requested a substratum to be built and rendered.
    console.log('stratum ' + path + ' event: stratumrequest for ' + ev.path)
    // Stratum build might be heavy. To avoid blocking click interaction
    // too long, place the build last in the event loop. Thus timeout 0.
    setTimeout(() => {
      // Note the recursive nature of the call.
      this.createStratum(ev.path, ev.context, ev.label, ev.bgColor, ev.position)
    }, 0)
  })

  stratum.on('final', (ev) => {
    console.log('stratum ' + path + ' event: final')
  })

  return stratum
}
