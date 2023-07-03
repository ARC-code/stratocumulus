const buildClassNames = (attrs) => {
  let classNames = 'node'
  if (attrs.isFacetable) {
    classNames += ' facetable'
  }
  // Kind for coloring
  if (attrs.kind) {
    classNames += ' node-' + attrs.kind
  }
  return classNames
}

const buildDataAttrs = (attrs) => {
  // Build string for element data attributes
  //
  let dataAttrs = ''
  for (const a in attrs) {
    dataAttrs += ` data-${a}="${attrs[a]}"`
  }

  return dataAttrs
}

const buildNodeElement = (attrs) => {
  const classNames = buildClassNames(attrs)
  const dataAttrs = buildDataAttrs(attrs)
  return `<div class="${classNames}" ${dataAttrs}></div>`
}

const buildLabelClassNames = (attrs) => {
  let classNames = 'label'
  if (attrs.isFacetable) {
    classNames += ' facetable'
  }
  return classNames
}

const buildLabelElement = (attrs) => {
  const classNames = buildLabelClassNames(attrs)
  const localCount = attrs.value.toLocaleString('en-US')
  const labelCount = `<div class="node-label-count">${localCount}</div>`
  const renderLabel = attrs.kind !== 'grouping'
  const labelContent = attrs.label + (renderLabel ? labelCount : '')
  return `<span class="${classNames}">${labelContent}</span>`
}

module.exports = (attrs) => {
  const nodeEl = buildNodeElement(attrs)
  const labelEl = buildLabelElement(attrs)

  return nodeEl + '\n' + labelEl
}
