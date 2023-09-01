const yamdog = require('yamdog')
const path = require('path')
const version = require('../../package.json').version
const introText = require('./intro')
const deco = yamdog.decorators
const mdnDocs = 'https://developer.mozilla.org/en-US/docs/Web/API/'
const tapspaceDocs = 'https://axelpale.github.io/tapspace/api/v2/'
const graphologyDocs = 'https://graphology.github.io/'

yamdog.generate({
  // Where to start collecting comment blocks
  entry: path.resolve(__dirname, '../../'),
  // Where to generate
  output: path.resolve(__dirname, '../architecture.md'),
  // Earmark; include blocks that begin with this name.
  earmark: '@',
  // Names; include these names
  names: {
    // Root index table of content
    'stratocumulus': 'stratocumulus',
    '0 Stratocumulus': '0 Stratocumulus', // TODO alphabetical hack
    // Components
    'ArtifactNode': 'ArtifactNode',
    'ArtifactStratum': 'ArtifactStratum',
    'CategoryNode': 'CategoryNode',
    'CategoryStratum': 'CategoryStratum',
    'Context': 'Context',
    'ContextForm': 'ContextForm',
    'ContextLabel': 'ContextLabel',
    'GraphStore': 'io.GraphStore',
    'io': 'io',
    'LabelStore': 'io.LabelStore',
    'PathManager': 'PathManager',
    'ReduxStore': 'ReduxStore',
    'Sky': 'Sky',
    'Spinner': 'Spinner',
    'Stratum': 'Stratum',
    'StratumNode': 'StratumNode',
    'TimeSlider': 'TimeSlider',
    'Toolbar': 'Toolbar',
    'ViewportManager': 'ViewportManager'
  },
  // Main title of the document
  title: 'Stratocumulus Client Documentation v' + version,
  // Introduction; the initial paragraph
  intro: introText,
  // Styling; decorate the docs
  decorators: [
    deco.alphabetical({
      groupCase: true
    }),
    deco.aliases(),
    deco.italicSingles(),
    deco.linkNames(),
    deco.linkKeywords({
      // Web APIs
      'HTMLElement': mdnDocs + 'HTMLElement',
      'Emitter': 'https://www.npmjs.com/package/component-emitter',
      'ResizeObserverEntry': mdnDocs + 'ResizeObserverEntry',
      // Terminology
      'Complexity': 'https://en.wikipedia.org/wiki/Computational_complexity',
      // Tapspace components and geometries
      'tapspace': tapspaceDocs,
      'tapspace.components.Viewport': tapspaceDocs + '#tapspacecomponentsviewport',
      'graphology': graphologyDocs
    }),
    deco.replace([
      {
        // Normalize parameters title
        pattern: /^param(?:eter)?s?:?/i,
        replacement: '**Parameters:**'
      },
      {
        // Normalize alt parameters title
        pattern: /^alt(?:ernative) param(?:eter)?s?:?/i,
        replacement: '**Parameters (alternative):**'
      },
      {
        // Normalize return title
        pattern: /^returns?:?/i,
        replacement: '**Returns:**'
      },
      {
        // Normalize throws title
        pattern: /^throws?:?/i,
        replacement: '**Throws:**'
      },
      {
        // Normalize usage title
        pattern: /^usage:?/i,
        replacement: '**Usage:**'
      },
      {
        // Normalize example title
        pattern: /^examples?:?/i,
        replacement: '**Example:**'
      },
      {
        // Normalize complexity title
        pattern: /^complexity?:?/i,
        replacement: '**Complexity:**'
      },
      {
        // Normalize under the hood
        pattern: /^\*?\*?under the hood:?\*?\*?/i,
        replacement: '**Under the hood:**'
      },
    ]),
    deco.toc({
      title: '**Contents:**'
    }),
    deco.sourceLinks({
      basePath: path.resolve(__dirname, '..', '..', '..'),
      baseUrl: 'https://github.com/ARC-code/stratocumulus/blob/main/'
    }),
    deco.backTopLinks()
  ]
})
