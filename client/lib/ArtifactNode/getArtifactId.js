module.exports = (attrs) => {
  // Get corpora artifact id from node attributes.
  //
  const parts = attrs.id.split('/')
  return parts[parts.length - 1]
}
