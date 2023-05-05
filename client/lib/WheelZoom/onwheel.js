module.exports = (viewport) => {
  // Return: function, the wheel event handler.
  //
  return (ev) => {
    // The scaling factor.
    const factor = 1 - ev.deltaY / 1000
    // The scaling pivot stays fixed.
    // Use gesture center. Represented on the viewport.
    const pivot = ev.center

    // Travel relative to the true event target.
    // The zooming effect at the target approximates scaling the view.
    // Note that if the pointer is on the background, the space itself is
    // the target and the space is at viewport depth.
    const camera = viewport.atCamera()
    // We aim to move camera closer to the point of gesture target.
    let selectedTarget // is a Component
    let pivotOnTarget // is a Point.
    // But what if target is the viewport itself? Or space?
    // Optimally, target mass nearest the gesture mean line.
    if (ev.target === viewport || ev.target === viewport.getHyperspace()) {
      // const possibleTarget = viewport.findNearestMass()
      // const possibleTarget = viewport.findNearestProjected(pivot)
      const possibleTarget = viewport.navigationBasis
      if (possibleTarget) {
        selectedTarget = possibleTarget
        pivotOnTarget = pivot.projectTo(possibleTarget, camera)
      } else {
        // Space is empty of solids. Thus use the viewport itself.
        selectedTarget = viewport
        pivotOnTarget = pivot
      }
    } else {
      // Target is a component in space.
      // We aim to move camera closer to the point of gesture target.
      if (ev.target.isSolid()) {
        selectedTarget = ev.target
        pivotOnTarget = pivot.projectTo(ev.target, camera)
      } else {
        // Pick closest solid behind the non-solid.
        // const possibleTarget = viewport.findNearestProjected(pivot)
        const possibleTarget = viewport.navigationBasis
        if (possibleTarget) {
          selectedTarget = possibleTarget
          pivotOnTarget = pivot.projectTo(possibleTarget, camera)
        } else {
          // Space is empty of solids, thus use the viewport itself.
          selectedTarget = viewport
          pivotOnTarget = pivot
        }
      }
    }

    // We want to scale the length of the vector from camera to target.
    const delta = camera.getVectorTo(pivotOnTarget)
    // The desired difference vector.
    const desired = delta.scaleBy(factor)
    // A trip the viewport must take in order to reach the desired diff.
    // delta + X = desired <=> X = desired - delta
    const trip = desired.difference(delta)
    // Travel
    viewport.translateBy(trip)

    // Upgrade event
    ev.navigationBasis = selectedTarget

    viewport.emit('wheel', ev)
  }
}
