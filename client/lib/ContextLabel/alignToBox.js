module.exports = function (bbox) {
  // Position the label inside a bounding box.
  //

  // Move below the stratum.
  this.component.match({
    source: this.component.atTopMid(),
    target: bbox.atNorm(0.5, 0.7)
  })

  // Scale so that it matches the stratum width.
  // If the space is empty, the width goes to zero and then scaling does
  // not work anymore. Thus prevent.
  const bboxWidth = bbox.getWidth().scaleBy(0.7)
  // TODO use something like tapspace.geometry.Box:isEmpty ?
  if (bboxWidth.getRaw() > 0) {
    this.component.scaleToWidth(bboxWidth, this.component.atTopMid())
  }
  // Else the box is empty, so we just match the space scale,
  // and that is already so.
}
