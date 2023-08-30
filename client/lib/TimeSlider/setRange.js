module.exports = function (yearRange) {
  // @TimeSlider:setRange(yearRange)
  //
  // Set slider position.
  //
  // Parameters:
  //   yearRange
  //     an object { rangeStart, rangeEnd }
  //
  const v1 = this.slider.value1
  const v2 = this.slider.value2
  const r1 = yearRange.rangeStart
  const r2 = yearRange.rangeEnd
  if (r1 !== v1) {
    this.slider.value1 = r1
  }
  if (r2 !== v2) {
    this.slider.value2 = r2
  }
}
