const buildClassNames = (attrs) => {
  let classNames = 'node-shape'
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
    // Skip non-serializable and large attributes
    if (a !== 'decades') {
      dataAttrs += ` data-${a}="${attrs[a]}"`
    }
  }

  return dataAttrs
}

const buildNodeElement = (attrs) => {
  const classNames = buildClassNames(attrs)
  const dataAttrs = buildDataAttrs(attrs)
  return `<div class="${classNames}" ${dataAttrs}></div>`
}

const buildLabelElement = (attrs) => {
  const localCount = attrs.value.toLocaleString('en-US')
  const labelCount = `<div class="node-label-count">${localCount}</div>`
  const renderLabel = attrs.kind !== 'grouping'
  const labelContent = attrs.label + (renderLabel ? labelCount : '')
  return `<div class="node-label">${labelContent}</div>`
}

module.exports = (attrs) => {
  // Stratum node template
  //

  if (attrs.kind !== 'grouping' && attrs.kind !== 'root') {
    const nodeHtml = buildNodeElement(attrs)
    const labelHtml = buildLabelElement(attrs)
    const contentHtml = nodeHtml + '\n' + labelHtml
    return contentHtml
  }

  // Non-facet nodes lack shape
  if (attrs.kind === 'grouping' || attrs.kind === 'root') {
    const labelHtml = buildLabelElement(attrs)
    return labelHtml
  }
}
