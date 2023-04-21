const nodeSize = require('./nodeSize')

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

const buildNodeElement = (id, attrs) => {
  const classNames = buildClassNames(attrs)
  const dataAttrs = buildDataAttrs(attrs)
  return `<div id="${id}-node" class="${classNames}"` +
    dataAttrs + '></div>'
}

const buildLabelClassNames = (attrs) => {
  let classNames = 'label'
  if (attrs.isFacetable) {
    classNames += ' facetable'
  }
  return classNames
}

const buildLabelStyle = (attrs) => {
  const size = nodeSize(attrs)
  const style = `
    font-size: ${size / 3}px;
    margin-top: ${size / 6}px;
    margin-left: ${size / 2}px;
  `
  return style.trim()
}

const buildLabelElement = (id, attrs) => {
  const classNames = buildLabelClassNames(attrs)
  const labelStyle = buildLabelStyle(attrs)
  const labelCount = `<div class="node-label-count">${attrs.value.toLocaleString('en-US')}</div>`
  return `<span id="${id}-label" class="${classNames}" ` +
    `style="${labelStyle}">${attrs.label}${attrs.isFacetable ? labelCount : ''}</span>`
}

module.exports = (id, attrs) => {
  const nodeEl = buildNodeElement(id, attrs)
  const labelEl = buildLabelElement(id, attrs)

  return nodeEl + '\n' + labelEl
}
