const config = require('../../../config');
const minNodeSize = config.sizing.minNodeSize;

module.exports = (attrs) => {
  // Get preferred visible node size from graph node attributes.
  //
  // Return
  //   a number
  //
  let size = minNodeSize;
  if ('size' in attrs) size = attrs.size;
  return size;
};
