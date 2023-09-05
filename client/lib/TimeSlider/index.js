require('./timeslider.css')
const emitter = require('component-emitter')
const roundYearStep = require('./roundYearStep')
const template = require('./template.ejs')
const config = require('../config')
// Run dependencies
require('toolcool-range-slider/dist/plugins/tcrs-marks.min.js')
require('toolcool-range-slider')

const YEAR_STEP = config.yearRange.resolution
const MIN_YEAR = config.yearRange.minYear
const MAX_YEAR = config.yearRange.maxYear
const THROTTLE_DELAY = 200 // ms

const TimeSlider = function () {
  // @TimeSlider
  //
  // A year-range slider.
  //
  this.element = document.createElement('div')
  this.element.className = 'time-slider-box'

  this.element.innerHTML = template({
    resolution: YEAR_STEP,
    minValue: MIN_YEAR,
    maxValue: MAX_YEAR
  })
  this.slider = this.element.querySelector('.time-slider')

  // Adjust slider style.
  // Can't use stylesheet since component uses shadow-DOM.
  // Slider API not yet available, set font at next event loop frame.
  setTimeout(() => {
    this.slider.addCSS(
      '.mark-value {' +
      'font-family: Arial, Helvetica, sans-serif;' +
      '}'
    )
  }, 0)

  this.timer = null

  // Setup time slider
  this.slider.addEventListener('onMouseUp', (evt) => {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      // Round slider values to decades, centuries, or what is configured.
      const rangeStart = roundYearStep(this.slider.value1, YEAR_STEP)
      const rangeEnd = roundYearStep(this.slider.value2, YEAR_STEP)
      // Signal the range has changed.
      this.emit('change', { rangeStart, rangeEnd })
    }, THROTTLE_DELAY)
  })
}

module.exports = TimeSlider
const proto = TimeSlider.prototype

// Inherit
emitter(proto)

// Methods
proto.getElement = require('./getElement')
proto.setRange = require('./setRange')
