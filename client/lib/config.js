exports.rendering = {
  stratumSize: 2560, // px
  categoryNodeSize: 256, // px
  artifactNodeSize: 512 // px
}

exports.sizing = {
  maxNodeSize: 100,
  minNodeSize: 10,
  maxValue: 100,
  minValue: 10
}

// Artifacts
exports.artifacts = {
  threshold: 100, // min facetable count
  pageSize: 9
}

// Required server-provided configuration
const required = [
  { key: 'sseStreamUrl', type: 'string' },
  { key: 'sseStreamKey', type: 'string' },
  { key: 'corporaApiPrefix', type: 'string' },
  { key: 'facetParameters', type: 'array' },
  { key: 'filterParameters', type: 'array' },
  { key: 'yearRange', type: 'object' },
  { key: 'agentRoleMapping', type: 'object' }
]

exports.validate = () => {
  // @config.validate()
  //
  // Validate the server-provided configuration.
  //
  if (!window || !window.stratocumulus) {
    throw new Error('Missing window.stratocumulus configuration object.')
  }
  const conf = window.stratocumulus

  for (let i = 0; i < required.length; i += 1) {
    const schemaItem = required[i]
    const key = schemaItem.key
    const type = schemaItem.type

    if (!conf[key]) {
      throw new Error('Missing configuration: window.stratocumulus.' + key)
    }

    if (type === 'array') {
      if (!Array.isArray(conf[key])) {
        throw new Error('Invalid configuration: window.stratocumulus.' + key)
      }
    } else {
      if (typeof conf[key] !== type) {
        throw new Error('Invalid configuration: window.stratocumulus.' + key)
      }
    }
  }

  // No errors, everything ok
}
