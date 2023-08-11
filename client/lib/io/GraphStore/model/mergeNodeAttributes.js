module.exports = (nodeAttrs, newAttrs) => {
  // Construct updated node attributes by merging new attributes to
  // current ones. Overwrite existing property values.
  // Do not modify the given objects, return a new object.
  //
  // Parameters:
  //   nodeAttrs
  //     an object, the current node attributes
  //   newAttrs
  //     an object, new node attributes.
  //     May exclude previously added attributes.
  //
  const changeSet = {}

  // Hand-pick incoming attributes
  if ('kind' in newAttrs && newAttrs.kind.length > 0) {
    changeSet.kind = newAttrs.kind
  }
  if ('value' in newAttrs) {
    changeSet.value = newAttrs.value
  }
  if ('label' in newAttrs) {
    changeSet.label = newAttrs.label
  }
  if ('fixed' in newAttrs) {
    changeSet.fixed = newAttrs.fixed
  }
  if ('parent' in newAttrs) {
    changeSet.parent = newAttrs.parent
  }
  if ('is_facetable' in newAttrs) {
    changeSet.isFacetable = newAttrs.is_facetable
  }
  if ('facet_param' in newAttrs) {
    changeSet.facetParam = newAttrs.facet_param
  }
  if ('facet_value' in newAttrs) {
    changeSet.facetValue = newAttrs.facet_value
  }

  const mergedAttrs = Object.assign({}, nodeAttrs, changeSet)

  return mergedAttrs
}
