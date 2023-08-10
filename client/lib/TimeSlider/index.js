require('./timeslider.css')
const emitter = require('component-emitter')
const roundDecade = require('./roundDecade')
const template = require('./template.ejs')
const config = require('../config')
// Run dependencies
require('toolcool-range-slider/dist/plugins/tcrs-marks.min.js')
require('toolcool-range-slider')

const THROTTLE_DELAY = 200 // ms

const TimeSlider = function () {
  // A year-range slider.
  //
  this.element = document.createElement('div')
  this.element.className = 'time-slider-box'

  this.element.innerHTML = template({
    minValue: config.decades.minDecade,
    maxValue: config.decades.maxDecade
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
  this.slider.addEventListener('change', (evt) => {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      // Slider values to decades
      const rangeStart = roundDecade(this.slider.value1)
      const rangeEnd = roundDecade(this.slider.value2)
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
