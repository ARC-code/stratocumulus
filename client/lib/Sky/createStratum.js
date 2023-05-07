const Stratum = require('../Stratum')

module.exports = function (path, context, label, bgColor, position, scale) {
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
  //   scale
  //     tapspace Scale, the scale of the stratum
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

  // Build
  const stratum = new Stratum(path, context, label, bgColor)

  // Place into space DOM. Stratum (0,0,0) will match with the position.
  // TODO use FractalLoader for placing the content.
  this.space.addChild(stratum.space, position)
  stratum.space.setScale(scale, position)

  // Keep track of what strata we have built.
  this.strata[path] = stratum
  this.strataTrail.push(stratum.path)
  this.currentStratum = this.strataTrail.length - 1

  // Begin loading and rendering
  stratum.load()

  stratum.on('stratumrequest', (ev) => {
    // This event tells us that an interaction within the stratum
    // requested a substratum to be built and rendered.

    // Stratum build might be heavy. To avoid blocking click interaction
    // too long, place the build last in the event loop. Thus timeout 0.
    setTimeout(() => {
      // Note the recursive nature of the call.
      this.createStratum(
        ev.path,
        ev.context,
        ev.label,
        ev.bgColor,
        ev.position,
        ev.scale.scaleBy(0.1)
      )
    }, 0)
  })

  return stratum
}
