// @0 Stratocumulus
//
// Abstract Components:
// - Stratum, a collection of nodes and edges
// - StratumNode, a node on a Stratum
//
// Components:
// - ArtifactNode, a node that displays single entity as a card.
// - ArtifactStratum, an assortment of artifacts
// - CategoryNode, an openable node that represents a collection of artifacts.
// - CategoryStratum, a network graph of faceting categories
// - ContextForm, a widget to display the current navigation path and filters.
// - ContextLabel, a label displaying stratum path in readable form
// - SearchForm, a text search form
// - Sky, a loader for nested strata
// - TimeSlider, a control widget for time range filtering
// - Toolbar, a container for search and filtering tools.
// - ViewportManager, a helper class to setup Sky viewport.
//
// Data Models:
// - Context, an ordered set of filtering and faceting parameters and values
// - GraphStore, a caching layer for loading stratum graphs
// - LabelStore, a caching layer for facet node labels
// - ReduxStore, a minimal redux-like state management
//
// Adapters:
// - io.corpora, fetch methods specific to Corpora API
// - io.stream, SSE stream handling
//
// Libraries:
// - tapspace, provides zoomable user interface
// - graphology, provides graph models
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
