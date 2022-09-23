const config = require('../../../config');
const min_node_size = config.sizing.min_node_size;

module.exports = (attrs) => {
  // Get preferred visible node size from graph node attributes.
  //
  // Return
  //   a number
  //
  let size = min_node_size;
  if ('size' in attrs) size = attrs.size;
  return size;
};
