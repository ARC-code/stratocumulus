module.exports = function () {
  // @Sky:findCurrentStratum()
  //
  // Find the current stratum. Can be null.
  //
  // Return
  //   a Stratum
  //   or null, if no suitable stratum found.
  //
  const strata = this.strata
  const loader = this.loader
  const viewport = this.viewport

  // The current stratum must be alive and in the space.
  const aliveStrata = Object.values(strata).filter(stratum => {
    return stratum.alive && loader.hasSpace(stratum.path)
  })

  if (aliveStrata.length === 0) {
    return null
  }

  // Update bounds
  aliveStrata.forEach(stratum => stratum.recomputeBoundingCircle())

  // The current stratum must have viewport center inside it.
  const pin = viewport.atCenter()
  const pinnedStrata = aliveStrata.filter(stratum => {
    if (!stratum.space.getViewport()) {
      throw new Error('Disconnected space detected: ' + stratum.path)
    }
    return stratum.boundingCircle.detectCollision(pin)
  })

  if (pinnedStrata.length === 0) {
    // No pinned strata. Rely on previous.
    return null
  }

  // Compute strata areas for ranking them.
  const viewportArea = viewport.getBoundingBox().getArea().getRaw()
  const pinnedAreaStrata = pinnedStrata.map(stratum => {
    const area = stratum.boundingCircle.getArea().transitRaw(viewport)
    const areaRatio = area / viewportArea
    return { stratum, area, areaRatio }
  })

  // The current stratum must be visually large.
  const reachableAreaStrata = pinnedAreaStrata.filter(areaStratum => {
    return areaStratum.areaRatio > 0.2
  })

  if (reachableAreaStrata.length === 0) {
    // There are pinned strata but no big enough strata.
    // Pick the largest of the pinned.
    const largest = pinnedAreaStrata.reduce((acc, areaStratum) => {
      if (areaStratum.area >= acc.maxArea) {
        return {
          maxArea: areaStratum.area,
          maxStratum: areaStratum.stratum
        }
      }
      return acc
    }, {
      maxArea: 0,
      maxStratum: null
    })

    return largest.maxStratum
  }

  // Select smallest of the reachable strata to be the current stratum.
  const smallest = reachableAreaStrata.reduce((acc, areaStratum) => {
    if (areaStratum.area < acc.minArea) {
      return {
        minArea: areaStratum.area,
        minStratum: areaStratum.stratum
      }
    }
    return acc
  }, {
    minArea: Infinity,
    minStratum: null
  })

  // Note minStratum may be null.
  return smallest.minStratum
}
