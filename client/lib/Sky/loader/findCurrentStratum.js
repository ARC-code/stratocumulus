module.exports = (sky) => {
  // Find the current stratum. Can be null.
  //

  // The current stratum must be alive and in the space.
  const strata = Object.values(sky.strata).filter(stratum => {
    return stratum.alive && sky.loader.hasSpace(stratum.path)
  })

  if (strata.length === 0) {
    return null
  }

  // Update bounds
  strata.forEach(stratum => stratum.recomputeBoundingCircle())

  // The current stratum must have viewport center inside it.
  const pin = sky.viewport.atCenter()
  const pinnedStrata = strata.filter(stratum => {
    if (!stratum.space.getViewport()) {
      throw new Error('Disconnected space detected: ' + stratum.path)
    }
    return stratum.boundingCircle.detectCollision(pin)
  })

  // The current stratum must be visually large.
  const viewportArea = sky.viewport.getBoundingBox().getArea().getRaw()
  const reachableStrata = pinnedStrata.filter(stratum => {
    const area = stratum.boundingCircle.getArea().transitRaw(sky.viewport)
    const areaRatio = area / viewportArea
    return areaRatio > 0.2
  })

  // Select smallest of the reachable strata to be the current stratum.
  const smallest = reachableStrata.reduce((acc, stratum) => {
    const area = stratum.boundingCircle.getArea().transitRaw(sky.viewport)
    if (area < acc.minArea) {
      return {
        minArea: area,
        minStratum: stratum
      }
    }
    return acc
  }, {
    minArea: Infinity,
    minStratum: null
  })

  // Note minStratum may be null.
  const currentStratum = smallest.minStratum

  return currentStratum
}
