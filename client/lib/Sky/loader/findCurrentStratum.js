module.exports = (sky) => {
  // Find the current stratum. Can be null.
  //

  const strata = Object.values(sky.strata).filter(stratum => stratum.alive)

  if (strata.length === 0) {
    return null
  }

  strata.forEach(stratum => stratum.recomputeBoundingCircle())

  // The current stratum must have viewport center inside it.
  const pin = sky.viewport.atCenter()
  const pinnedStrata = strata.filter(stratum => {
    return stratum.boundingCircle.detectCollision(pin)
  })

  // The current stratum must be visually large.
  const reachableStrata = pinnedStrata.filter(stratum => {
    const area = stratum.boundingCircle.getArea().transitRaw(sky.viewport)
    const viewportArea = sky.viewport.getBoundingBox().getArea().getRaw()
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

  const currentStratum = smallest.minStratum

  return currentStratum
}
