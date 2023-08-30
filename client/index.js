// @0 Stratocumulus
//
// Abstract Components:
// - Stratum
// - StratumNode
//
// Components:
// - ArtifactNode
// - ArtifactStratum
// - CategoryNode
// - CategoryStratum
// - ContextForm
// - ContextLabel
// - SearchForm
// - Sky
// - TimeSlider
// - Toolbar
// - ViewportManager
//
// Data Models:
// - Context
// - GraphStore
// - LabelStore
// - ReduxStore
//
// Adapters:
// - io.corpora
// - io.stream
//
// Libraries
// - tapspace
// - graphology
//

// NOTE
// This is the client root index.
// If you modify this file, you need to rebuild the docker image
// for the changes to take effect.

const app = require('./lib')

// Start the app only after all HTML and scripts are loaded.
document.addEventListener('DOMContentLoaded', function () {
  app.start()
})
