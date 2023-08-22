module.exports = (attrs) => {
  // Get artifact id from node attributes.
  //
  const parts = attrs.id.split('/')
  return parts[parts.length - 1]
}
