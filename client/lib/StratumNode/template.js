const buildClassNames = (attrs) => {
  let classNames = 'node-shape'
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
  let classNames = 'node-label'
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
  return `<div class="${classNames}">${labelContent}</div>`
}

module.exports = (attrs) => {
  // Stratum node template
  //
  const nodeHtml = buildNodeElement(attrs)
  const labelHtml = buildLabelElement(attrs)
  const contentHtml = nodeHtml + '\n' + labelHtml
  return contentHtml
}
