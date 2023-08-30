module.exports = function (isEnabled) {
  // @CategoryNode:setLoadingAnimation(isEnabled)
  //
  // Set if loading animation running or not.
  //
  // Parameters:
  //   isEnabled
  //     a boolean
  //
  if (isEnabled) {
    this.component.addClass('loading')
  } else {
    this.component.removeClass('loading')
  }
}
