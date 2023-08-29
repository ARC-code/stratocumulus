module.exports = function (isEnabled) {
  // Set if loading animation running or not.
  //
  if (isEnabled) {
    this.component.addClass('loading')
  } else {
    this.component.removeClass('loading')
  }
}
