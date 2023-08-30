<a name="top"></a>
# Stratocumulus Client Documentation v0.3.0


Welcome to Stratocumulus client architecture and interface documentation.

This document follows these naming conventions: `ClassName`, `namespace`, `.CONSTANT`, `.classMethod()`, `:instanceProperty`, `:instanceMethod()`, and `[optionalParameter]`.

See also: [Introduction](https://github.com/ARC-code/stratocumulus) – [Examples](https://github.com/ARC-code/stratocumulus) - [GitHub](https://github.com/ARC-code/stratocumulus)

This document is generated with [yamdog](https://github.com/axelpale/yamdog).



<a name="0stratocumulus"></a>
## [0](#0) [Stratocumulus](#0stratocumulus)

<p style="margin-bottom: 0">Abstract Components:</p>

- [Stratum](#stratum), a collection of nodes and edges
- [StratumNode](#stratumnode), a node on a [Stratum](#stratum)


<p style="margin-bottom: 0">Components:</p>

- [ArtifactNode](#artifactnode), a node that displays single entity as a card.
- [ArtifactStratum](#artifactstratum), an assortment of artifacts
- [CategoryNode](#categorynode), an openable node that represents a collection of artifacts.
- [CategoryStratum](#categorystratum), a network graph of faceting categories
- [ContextForm](#contextform), a widget to display the current navigation path and filters.
- [ContextLabel](#contextlabel), a label displaying stratum path in readable form
- SearchForm, a text search form
- [Sky](#sky), a loader for nested strata
- [TimeSlider](#timeslider), a control widget for time range filtering
- [Toolbar](#toolbar), a container for search and filtering tools.
- [ViewportManager](#viewportmanager), a helper class to setup [Sky](#sky) viewport.


<p style="margin-bottom: 0">Data Models:</p>

- [Context](#context), an ordered set of filtering and faceting parameters and values
- [GraphStore](#iographstore), a caching layer for loading stratum graphs
- [LabelStore](#iolabelstore), a caching layer for facet node labels
- [ReduxStore](#reduxstore), a minimal redux-like state management


<p style="margin-bottom: 0">Adapters:</p>

- [io](#io).corpora, fetch methods specific to Corpora API
- [io](#io).stream, SSE stream handling


<p style="margin-bottom: 0">Libraries:</p>

- [tapspace](https://axelpale.github.io/tapspace/api/v2/), provides zoomable user interface
- [graphology](https://graphology.github.io/), provides graph models


Source: [client/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/index.js)

<a name="artifactnode"></a>
## [ArtifactNode](#artifactnode)(key)

Inherits [StratumNode](#stratumnode)

[ArtifactNode](#artifactnode) is a card-like element in space.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *key*
  - a string, node key



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [ArtifactNode:render](#artifactnoderender)


Source: [ArtifactNode/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ArtifactNode/index.js)

<a name="artifactnoderender"></a>
## [ArtifactNode](#artifactnode):[render](#artifactnoderender)()

Refesh the content.

Source: [render.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ArtifactNode/render.js)

<a name="artifactstratum"></a>
## [ArtifactStratum](#artifactstratum)(context)

Inherits [Stratum](#stratum)

[ArtifactStratum](#artifactstratum) is a document collection laid on a plane.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context). The context gives identity to the artifact plane and defines the faceting and filtering of its content.


<p style="margin-bottom: 0"><a href="#artifactstratum">ArtifactStratum</a> emits:</p>

- *first*
  - when the first node has been loaded and rendered.
- *final*
  - when all nodes of the stratum has been loaded and rendered.
- *substratumrequest*
  - when the stratum would like one of its nodes to be opened as a new stratum.



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [ArtifactStratum:filter](#artifactstratumfilter)
- [ArtifactStratum:getBasisForSubstratum](#artifactstratumgetbasisforsubstratum)
- [ArtifactStratum:load](#artifactstratumload)
- [ArtifactStratum:remove](#artifactstratumremove)
- [ArtifactStratum:render](#artifactstratumrender)
- [ArtifactStratum:serveSubstratum](#artifactstratumservesubstratum)
- [ArtifactStratum:triggerSubstratum](#artifactstratumtriggersubstratum)


Source: [ArtifactStratum/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ArtifactStratum/index.js)

<a name="artifactstratumfilter"></a>
## [ArtifactStratum](#artifactstratum):[filter](#artifactstratumfilter)(context)

Filter the stratum by a filtering context.
TODO

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context). The context can include faceting parameters but only filtering parameters have effect here.


Source: [filter.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ArtifactStratum/filter.js)

<a name="artifactstratumgetbasisforsubstratum"></a>
## [ArtifactStratum](#artifactstratum):[getBasisForSubstratum](#artifactstratumgetbasisforsubstratum)(subcontext)

Overrides [Stratum:getBasisForSubstratum](#stratumgetbasisforsubstratum)

The method returns a basis for the given subcontext.
The basis is useful to position substrata.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *subcontext*
  - a [Context](#context)


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [tapspace](https://axelpale.github.io/tapspace/api/v2/).geometry.Basis


Source: [getBasisForSubstratum.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ArtifactStratum/getBasisForSubstratum.js)

<a name="artifactstratumload"></a>
## [ArtifactStratum](#artifactstratum):[load](#artifactstratumload)()

Begin constructing stratum from the back-end.
This makes the stratum alive.

Source: [load.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ArtifactStratum/load.js)

<a name="artifactstratumremove"></a>
## [ArtifactStratum](#artifactstratum):[remove](#artifactstratumremove)()

Destroy the [ArtifactStratum](#artifactstratum). Stop loading and kill listeners.
However, does not remove the plane from the DOM.

Source: [remove.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ArtifactStratum/remove.js)

<a name="artifactstratumrender"></a>
## [ArtifactStratum](#artifactstratum):[render](#artifactstratumrender)()

Render artifacts. If elements already exist, update.
This method is idempotent, thus you can call this method multiple times
without unexpected side effects.

Source: [render.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ArtifactStratum/render.js)

<a name="artifactstratumservesubstratum"></a>
## [ArtifactStratum](#artifactstratum):[serveSubstratum](#artifactstratumservesubstratum)(params)

The purspose of serveSubstratum is to orchestrate the content of
this stratum so that its look and feel agrees with the loading state of
the substratum.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *params*
  - an object with properties:
    - *subcontext*
      - a [Context](#context)
    - *stage*
      - a string


Source: [serveSubstratum.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ArtifactStratum/serveSubstratum.js)

<a name="artifactstratumtriggersubstratum"></a>
## [ArtifactStratum](#artifactstratum):[triggerSubstratum](#artifactstratumtriggersubstratum)(viewport)

This method implements viewport dependent behavior
that subsequently initiates the loading of substratum if
zoom level and other viewport conditions so allow.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *viewport*
  - a [tapspace](https://axelpale.github.io/tapspace/api/v2/).components.Viewport


Source: [triggerSubstratum.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ArtifactStratum/triggerSubstratum.js)

<a name="categorynode"></a>
## [CategoryNode](#categorynode)(key, attrs)

Inherits [ArtifactNode](#artifactnode)

A node in a stratum. [Stratum](#stratum) maintains set of nodes.
A slave component, causes only visual side-effects, model-ignorant.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *key*
  - string, graph node key, e.g. "/arc/genres" or "/arc/genres/1234"
- *attrs*
  - object, the node attributes from the graph.


<p style="margin-bottom: 0">Emits:</p>

- openingrequest `{ nodeKey: <string>, item: <Component> }`
  - when the user interacts with the node in order to open something.



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [CategoryNode:makeClosed](#categorynodemakeclosed)
- [CategoryNode:makeOpened](#categorynodemakeopened)
- [CategoryNode:render](#categorynoderender)
- [CategoryNode:setLoadingAnimation](#categorynodesetloadinganimation)


Source: [CategoryNode/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryNode/index.js)

<a name="categorynodemakeclosed"></a>
## [CategoryNode](#categorynode):[makeClosed](#categorynodemakeclosed)()

Make the node look and behave like it has been closed.

Source: [makeClosed.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryNode/makeClosed.js)

<a name="categorynodemakeopened"></a>
## [CategoryNode](#categorynode):[makeOpened](#categorynodemakeopened)()

Make the node look and behave like it has been opened.

Source: [makeOpened.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryNode/makeOpened.js)

<a name="categorynoderender"></a>
## [CategoryNode](#categorynode):[render](#categorynoderender)()

Refresh the contents.

Source: [render.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryNode/render.js)

<a name="categorynodesetloadinganimation"></a>
## [CategoryNode](#categorynode):[setLoadingAnimation](#categorynodesetloadinganimation)(isEnabled)

Set if loading animation running or not.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *isEnabled*
  - a boolean


Source: [setLoadingAnimation.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryNode/setLoadingAnimation.js)

<a name="categorystratum"></a>
## [CategoryStratum](#categorystratum)(context)

A tree graph laid on a plane.
The stratum is not yet added to the document.
Append stratum.space to a parent space in order to do that.

[CategoryStratum](#categorystratum) inherits [Stratum](#stratum)

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context). The context gives identity to the stratum and defines the faceting and filtering of its content.


<p style="margin-bottom: 0"><a href="#categorystratum">CategoryStratum</a> emits:</p>

- *first*
  - when the first node has been loaded and rendered.
- *final*
  - when all nodes of the stratum have been loaded and rendered.
- *substratumrequest*
  - when the stratum would like one of its nodes to be opened as a new stratum. Emitted with an object { context } where the context is the requested context of the substratum.
- *layout*
  - when the stratum layout changes



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [CategoryStratum:enableFaceting](#categorystratumenablefaceting)
- [CategoryStratum:filter](#categorystratumfilter)
- [CategoryStratum:findNearbyNode](#categorystratumfindnearbynode)
- [CategoryStratum:getBasisForSubstratum](#categorystratumgetbasisforsubstratum)
- [CategoryStratum:getFacetNode](#categorystratumgetfacetnode)
- [CategoryStratum:load](#categorystratumload)
- [CategoryStratum:prune](#categorystratumprune)
- [CategoryStratum:refreshNodeSizes](#categorystratumrefreshnodesizes)
- [CategoryStratum:remove](#categorystratumremove)
- [CategoryStratum:render](#categorystratumrender)
- [CategoryStratum:renderContextLabel](#categorystratumrendercontextlabel)
- [CategoryStratum:revealLabels](#categorystratumreveallabels)
- [CategoryStratum:serveSubstratum](#categorystratumservesubstratum)
- [CategoryStratum:triggerSubstratum](#categorystratumtriggersubstratum)


Source: [CategoryStratum/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/index.js)

<a name="categorystratumenablefaceting"></a>
## [CategoryStratum](#categorystratum):[enableFaceting](#categorystratumenablefaceting)()

Enable stratum faceting.
In other words, listen nodes for opening requests.

Source: [enableFaceting.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/enableFaceting.js)

<a name="categorystratumfilter"></a>
## [CategoryStratum](#categorystratum):[filter](#categorystratumfilter)(context)

Filter the stratum by a filtering context.
This will send a new stratum build job.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context). The context can include faceting parameters but only filtering parameters have effect here.


Source: [filter.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/filter.js)

<a name="categorystratumfindnearbynode"></a>
## [CategoryStratum](#categorystratum):[findNearbyNode](#categorystratumfindnearbynode)(viewport)

Find a stratum node close to viewport. The result can be null.

Source: [findNearbyNode.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/findNearbyNode.js)

<a name="categorystratumgetbasisforsubstratum"></a>
## [CategoryStratum](#categorystratum):[getBasisForSubstratum](#categorystratumgetbasisforsubstratum)(subcontext)

Overrides [Stratum:getBasisForSubstratum](#stratumgetbasisforsubstratum)

The method returns a basis for the given subcontext.
The basis equals the basis of the facet node that
represents the substratum.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *subcontext*
  - a [Context](#context)


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [tapspace](https://axelpale.github.io/tapspace/api/v2/).geometry.Basis or null if no basis found for the subcontext.


Source: [getBasisForSubstratum.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/getBasisForSubstratum.js)

<a name="categorystratumgetfacetnode"></a>
## [CategoryStratum](#categorystratum):[getFacetNode](#categorystratumgetfacetnode)(subcontext)

Get a node by its subcontext. Can be null if no node found.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *subcontext*
  - a [Context](#context). The subcontext of the node.


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [CategoryNode](#categorynode) or null


Source: [getFacetNode.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/getFacetNode.js)

<a name="categorystratumload"></a>
## [CategoryStratum](#categorystratum):[load](#categorystratumload)()

Begin constructing stratum from the back-end.
This makes the stratum alive.

Source: [load.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/load.js)

<a name="categorystratumprune"></a>
## [CategoryStratum](#categorystratum):[prune](#categorystratumprune)()

Remove all graph node and edge elements that do not anymore exist in
the given graph.

Source: [prune.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/prune.js)

<a name="categorystratumrefreshnodesizes"></a>
## [CategoryStratum](#categorystratum):[refreshNodeSizes](#categorystratumrefreshnodesizes)()

Refresh the node sizes. Does not change layout.

Source: [refreshNodeSizes.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/refreshNodeSizes.js)

<a name="categorystratumremove"></a>
## [CategoryStratum](#categorystratum):[remove](#categorystratumremove)()

Destroy the stratum. Stop loading and kill listeners.
However, does not remove the stratum from the DOM.

Source: [remove.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/remove.js)

<a name="categorystratumrender"></a>
## [CategoryStratum](#categorystratum):[render](#categorystratumrender)(final, updateCount)

Render the graph. If elements already exist, update.
This method is idempotent, thus you can call this method multiple times
for example once for every new substratum from the server.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *final*
  - optional boolean, default false. Set true to update edges
- *updateCount*
  - optional integer, default 0. Index number of the subgraph event. Useful to identify and distinguish early and late rendering stages.


Source: [render.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/render.js)

<a name="categorystratumrendercontextlabel"></a>
## [CategoryStratum](#categorystratum):[renderContextLabel](#categorystratumrendercontextlabel)()

Render or update the large text label
that tells the user how the stratum was formed.

Source: [renderContextLabel.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/renderContextLabel.js)

<a name="categorystratumreveallabels"></a>
## [CategoryStratum](#categorystratum):[revealLabels](#categorystratumreveallabels)()

Refresh the label visibility in a semantic zoom manner.
Reveals and hides the labels based on their apparent size.

Source: [revealLabels.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/revealLabels.js)

<a name="categorystratumservesubstratum"></a>
## [CategoryStratum](#categorystratum):[serveSubstratum](#categorystratumservesubstratum)(params)

The purspose of serveSubstratum is to orchestrate the content of
this stratum so that its look and feel agrees with the loading state of
the substratum.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *params*
  - an object with properties:
    - *subcontext*
      - a [Context](#context)
    - *stage*
      - a string


Source: [serveSubstratum.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/serveSubstratum.js)

<a name="categorystratumtriggersubstratum"></a>
## [CategoryStratum](#categorystratum):[triggerSubstratum](#categorystratumtriggersubstratum)(viewport)

This method implements viewport dependent behavior
that subsequently initiates the loading of substratum if
zoom level and other viewport conditions so allow.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *viewport*
  - a [tapspace](https://axelpale.github.io/tapspace/api/v2/).components.Viewport


Source: [triggerSubstratum.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/CategoryStratum/triggerSubstratum.js)

<a name="context"></a>
## [Context](#context)(keys, values)

Class and methods for handling Corpora context objects.
Keeps the keys and values in the correct order.
Immutable.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *keys*
  - array of string
- *values*
  - array of string



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [Context:add](#contextadd)
- [Context:copy](#contextcopy)
- [Context:each](#contexteach)
- [Context:equals](#contextequals)
- [Context:filter](#contextfilter)
- [Context:getFacetingContext](#contextgetfacetingcontext)
- [Context:getFilteringContext](#contextgetfilteringcontext)
- [Context:getLastFacet](#contextgetlastfacet)
- [Context:getRangeValue](#contextgetrangevalue)
- [Context:getValue](#contextgetvalue)
- [Context:hasParameter](#contexthasparameter)
- [Context:hasValue](#contexthasvalue)
- [Context:map](#contextmap)
- [Context:merge](#contextmerge)
- [Context:remove](#contextremove)
- [Context:removeLastFacet](#contextremovelastfacet)
- [Context:toArray](#contexttoarray)
- [Context:toCacheKey](#contexttocachekey)
- [Context:toContextObject](#contexttocontextobject)
- [Context:toFacetPath](#contexttofacetpath)
- [Context:toNodeKey](#contexttonodekey)
- [Context:toQueryString](#contexttoquerystring)
- [Context.fromContextObject](#contextfromcontextobject)
- [Context.fromFacetPath](#contextfromfacetpath)
- [Context.fromQueryString](#contextfromquerystring)
- [ContextForm:getElement](#contextformgetelement)
- [ContextForm:render](#contextformrender)
- [ContextForm:setContext](#contextformsetcontext)
- [ContextLabel:update](#contextlabelupdate)


Source: [Context/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/index.js)

<a name="contextadd"></a>
## [Context](#context):[add](#contextadd)(key, value)

Add a context parameter as the last parameter. Creates a new [Context](#context).

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *key*
  - a string
- *value*
  - a string


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context).


Source: [append.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/append.js)

<a name="contextcopy"></a>
## [Context](#context):[copy](#contextcopy)()

Clone the context.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context)


Source: [copy.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/copy.js)

<a name="contexteach"></a>
## [Context](#context):[each](#contexteach)(fn)

Call the function for each key-value pair.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *fn*
  - a function (key, value) => any


Source: [each.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/each.js)

<a name="contextequals"></a>
## [Context](#context):[equals](#contextequals)(ctx)

Test if two contexts are equal. Two context are equal if
they have the same parameters and values in same order.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *ctx*
  - a [Context](#context)


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a boolean


Source: [equals.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/equals.js)

<a name="contextfilter"></a>
## [Context](#context):[filter](#contextfilter)(fn)

Filter the context using a boolean function.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *fn*
  - a function (key, value) => bool


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context)


Source: [filter.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/filter.js)

<a name="contextgetfacetingcontext"></a>
## [Context](#context):[getFacetingContext](#contextgetfacetingcontext)()

Get a subset of this context that includes only non-filter parameters.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context)


Source: [getFacetingContext.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/getFacetingContext.js)

<a name="contextgetfilteringcontext"></a>
## [Context](#context):[getFilteringContext](#contextgetfilteringcontext)()

Get a subset of this context that includes only filtering parameters.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context)


Source: [getFilteringContext.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/getFilteringContext.js)

<a name="contextgetlastfacet"></a>
## [Context](#context):[getLastFacet](#contextgetlastfacet)()

Get the last faceting property as an object.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- an object { parameter, value } or null if empty


Source: [getLastFacet.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/getLastFacet.js)

<a name="contextgetrangevalue"></a>
## [Context](#context):[getRangeValue](#contextgetrangevalue)(param)

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a range object { rangeStart, rangeEnd }
- null if param not found.


Source: [getRangeValue.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/getRangeValue.js)

<a name="contextgetvalue"></a>
## [Context](#context):[getValue](#contextgetvalue)(param)

**Returns:** first value of the given parameter. Null if not found.

Source: [getValue.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/getValue.js)

<a name="contexthasparameter"></a>
## [Context](#context):[hasParameter](#contexthasparameter)(param)

Source: [hasParameter.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/hasParameter.js)

<a name="contexthasvalue"></a>
## [Context](#context):[hasValue](#contexthasvalue)(param, value)

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- *boolean*


Source: [hasValue.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/hasValue.js)

<a name="contextmap"></a>
## [Context](#context):[map](#contextmap)(fn)

Map the context to an array.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *fn*
  - a function (key, value) => any


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- an array


Source: [map.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/map.js)

<a name="contextmerge"></a>
## [Context](#context):[merge](#contextmerge)(ctx)

Merge with another context.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *ctx*
  - a [Context](#context)


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context)


Source: [merge.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/merge.js)

<a name="contextremove"></a>
## [Context](#context):[remove](#contextremove)(key[, value])

Remove a context parameter. Creates a new [Context](#context).

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *key*
  - a string
- *value*
  - optional string. If given, remove only this value.


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context).


Source: [remove.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/remove.js)

<a name="contextremovelastfacet"></a>
## [Context](#context):[removeLastFacet](#contextremovelastfacet)()

Remove the last faceting parameter, if any.
Faceting parameters are keys beginning with 'f_'
Useful for building broader context step by step.
Creates a new [Context](#context).

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context).


Source: [removeLastFacet.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/removeLastFacet.js)

<a name="contexttoarray"></a>
## [Context](#context):[toArray](#contexttoarray)()

Get the context as a serialized array.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- an array of parameter objects. Each object has properties:
  - *parameter*
    - a string
  - *value*
    - a string
  - *type*
    - an enum char, one of 'f', 'q', 'r'.


**Example:**
```
> context.toArray()
[{ parameter, value, type, typeChar }]
```

Source: [toArray.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/toArray.js)

<a name="contexttocachekey"></a>
## [Context](#context):[toCacheKey](#contexttocachekey)()

Build a cache key from the context.
Cache key has consistent order for the context parameters,
putting the filtering keys last.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a string, for example "/?f_genres.id=123"


Source: [toCacheKey.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/toCacheKey.js)

<a name="contexttocontextobject"></a>
## [Context](#context):[toContextObject](#contexttocontextobject)()

Get as a plain context object.
If the context has duplicate keys, their values are joined with '__'.
Note that a plain object does not maintain the key order.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- an object


Source: [toContextObject.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/toContextObject.js)

<a name="contexttofacetpath"></a>
## [Context](#context):[toFacetPath](#contexttofacetpath)()

Build a local URL path and facet query from the context.
A facet path begins with a slash and contain only faceting queries.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a string, for example "/?f_genres.id=123"


Source: [toFacetPath.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/toFacetPath.js)

<a name="contexttonodekey"></a>
## [Context](#context):[toNodeKey](#contexttonodekey)()

Take the last faceting property and build a node key from it.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a string, for example "/arc/disciplines/1234"


Source: [toNodeKey.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/toNodeKey.js)

<a name="contexttoquerystring"></a>
## [Context](#context):[toQueryString](#contexttoquerystring)()

Get the context as a query string, e.g. "f_genres.id=123&r_years=100to400"

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a string


Source: [toQueryString.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/toQueryString.js)

<a name="contextfromcontextobject"></a>
## [Context](#context).[fromContextObject](#contextfromcontextobject)(obj)

Create a [Context](#context) from an object.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *obj*
  - an object with string keys and string values.


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context)


Source: [fromContextObject.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/fromContextObject.js)

<a name="contextfromfacetpath"></a>
## [Context](#context).[fromFacetPath](#contextfromfacetpath)(path)

Create a context from a facet path, e.g. "/?f_genres.id=ABC"

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *path*
  - a string


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context)


Source: [fromFacetPath.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/fromFacetPath.js)

<a name="contextfromquerystring"></a>
## [Context](#context).[fromQueryString](#contextfromquerystring)(query)

Create a [Context](#context) from a query string, e.g. "f_genres.id=ABC"

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *query*
  - a string


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context)


Source: [fromQueryString.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Context/fromQueryString.js)

<a name="contextform"></a>
## [ContextForm](#contextform)()

[ContextForm](#contextform) is a viewer and editor for the current [Context](#context).
It emits events when the context is modified through it.
It provides methods to update the context it is currently viewing.

<p style="margin-bottom: 0">Emits:</p>

- clear { parameter }



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [ContextForm:getElement](#contextformgetelement)
- [ContextForm:render](#contextformrender)
- [ContextForm:setContext](#contextformsetcontext)


Source: [ContextForm/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Toolbar/ContextForm/index.js)

<a name="contextformgetelement"></a>
## [ContextForm](#contextform):[getElement](#contextformgetelement)()

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)


Source: [getElement.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Toolbar/ContextForm/getElement.js)

<a name="contextformrender"></a>
## [ContextForm](#contextform):[render](#contextformrender)()

Render the current context.

Source: [render.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Toolbar/ContextForm/render.js)

<a name="contextformsetcontext"></a>
## [ContextForm](#contextform):[setContext](#contextformsetcontext)(newContext)

Replace the context and render the new one.

Source: [setContext.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Toolbar/ContextForm/setContext.js)

<a name="contextlabel"></a>
## [ContextLabel](#contextlabel)(context)

A [Stratum](#stratum) context label. Displays the faceting context of the stratum.


<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [ContextLabel:update](#contextlabelupdate)


Source: [ContextLabel/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ContextLabel/index.js)

<a name="contextlabel"></a>
## [ContextLabel](#contextlabel)(bbox)

Position the label inside a bounding box.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *bbox*
  - a [tapspace](https://axelpale.github.io/tapspace/api/v2/).geometry.Box



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [ContextLabel:update](#contextlabelupdate)


Source: [alignToBox.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ContextLabel/alignToBox.js)

<a name="contextlabelupdate"></a>
## [ContextLabel](#contextlabel):[update](#contextlabelupdate)(context)

Update the context and render the label again.

Source: [update.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ContextLabel/update.js)

<a name="reduxstore"></a>
## [ReduxStore](#reduxstore)

This is a Redux-like store for updating a [Context](#context) object
and reacting to its changes.


<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [ReduxStore:dispatch](#reduxstoredispatch)
- [ReduxStore:getState](#reduxstoregetstate)
- [ReduxStore:subscribe](#reduxstoresubscribe)


Source: [ReduxStore/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ReduxStore/index.js)

<a name="reduxstoredispatch"></a>
## [ReduxStore](#reduxstore):[dispatch](#reduxstoredispatch)(action)

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *action*
  - an object to be processed by the reducer.


Source: [dispatch.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ReduxStore/dispatch.js)

<a name="reduxstoregetstate"></a>
## [ReduxStore](#reduxstore):[getState](#reduxstoregetstate)()

Get current state. In order to modify the state, dispatch actions.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- an object, the current state.


Source: [getState.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ReduxStore/getState.js)

<a name="reduxstoresubscribe"></a>
## [ReduxStore](#reduxstore):[subscribe](#reduxstoresubscribe)(handler)

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *handler*
  - a function () that is called when an action changes the state.


Source: [subscribe.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ReduxStore/subscribe.js)

<a name="sky"></a>
## [Sky](#sky)

[Sky](#sky) manages stratum objects and their loading.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *viewport*
  - a [tapspace](https://axelpale.github.io/tapspace/api/v2/).components.Viewport


<p style="margin-bottom: 0">Emits:</p>

- *navigation*
  - when there is a new current stratum.



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [Sky:filter](#skyfilter)
- [Sky:init](#skyinit)


Source: [Sky/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Sky/index.js)

<a name="skyfilter"></a>
## [Sky](#sky):[filter](#skyfilter)(context)

Filter the visible strata.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context), the filtering context. Faceting parameters are omitted.


Source: [filter.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Sky/filter.js)

<a name="skyinit"></a>
## [Sky](#sky):[init](#skyinit)(firstPath)

Initialize the [Sky](#sky): begin loading the first stratum.

Source: [init.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Sky/init.js)

<a name="stratum"></a>
## [Stratum](#stratum)(context)

Inherits [Emitter](https://www.npmjs.com/package/component-emitter)

Abstract class for [ArtifactStratum](#artifactstratum) and [CategoryStratum](#categorystratum).
All subclasses should expose the same interface for [Sky](#sky)
to handle them consistently.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context)



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [Stratum:filter](#stratumfilter)
- [Stratum:getBasisForSubstratum](#stratumgetbasisforsubstratum)
- [Stratum:getBoundingCircle](#stratumgetboundingcircle)
- [Stratum:getEverySubcontext](#stratumgeteverysubcontext)
- [Stratum:getNodes](#stratumgetnodes)
- [Stratum:getOrigin](#stratumgetorigin)
- [Stratum:getSpace](#stratumgetspace)
- [Stratum:getSubcontext](#stratumgetsubcontext)
- [Stratum:getSupercontext](#stratumgetsupercontext)
- [Stratum:navigateToNode](#stratumnavigatetonode)
- [Stratum:navigateToStratum](#stratumnavigatetostratum)
- [Stratum:recomputeBoundingCircle](#stratumrecomputeboundingcircle)
- [Stratum:render](#stratumrender)
- [Stratum:scaleNodesToFit](#stratumscalenodestofit)
- [Stratum:serveSubstratum](#stratumservesubstratum)
- [Stratum:triggerSubstratum](#stratumtriggersubstratum)
- [StratumNode:getOrigin](#stratumnodegetorigin)
- [StratumNode:getRadius](#stratumnodegetradius)
- [StratumNode:remove](#stratumnoderemove)
- [StratumNode:render](#stratumnoderender)
- [StratumNode:setScale](#stratumnodesetscale)
- [StratumNode:translateTo](#stratumnodetranslateto)
- [StratumNode:update](#stratumnodeupdate)


Source: [Stratum/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/index.js)

<a name="stratumfilter"></a>
## [Stratum](#stratum):[filter](#stratumfilter)(context)

A placeholder that ensures subclasses implement the method.

Filter the stratum by a filtering context.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context). The context can include faceting parameters but only filtering parameters have effect here.


Source: [filter.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/filter.js)

<a name="stratumgetbasisforsubstratum"></a>
## [Stratum](#stratum):[getBasisForSubstratum](#stratumgetbasisforsubstratum)(subcontext)

A placeholder that ensures subclasses implement the method.

The method should return a basis for the given subcontext.
Subclasses may invent their own substratum positioning logic.
Therefore this method is useful to abstract out the computation of
the basis from the [Sky](#sky) driver.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *subcontext*
  - a [Context](#context)


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [tapspace](https://axelpale.github.io/tapspace/api/v2/).geometry.Basis


Source: [getBasisForSubstratum.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/getBasisForSubstratum.js)

<a name="stratumgetboundingcircle"></a>
## [Stratum](#stratum):[getBoundingCircle](#stratumgetboundingcircle)()

Get the cached stratum boundary.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [tapspace](https://axelpale.github.io/tapspace/api/v2/).geometry.Sphere


Source: [getBoundingCircle.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/getBoundingCircle.js)

<a name="stratumgeteverysubcontext"></a>
## [Stratum](#stratum):[getEverySubcontext](#stratumgeteverysubcontext)()

Get the context of each substrata.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- an array of [Context](#context).


Source: [getEverySubcontext.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/getEverySubcontext.js)

<a name="stratumgetnodes"></a>
## [Stratum](#stratum):[getNodes](#stratumgetnodes)()

Get stratum nodes in an array.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- array of [StratumNode](#stratumnode)


Source: [getNodes.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/getNodes.js)

<a name="stratumgetorigin"></a>
## [Stratum](#stratum):[getOrigin](#stratumgetorigin)()

Get the origin point tensor of the stratum.
Useful for determining the anchor point of the stratum.
In future we might want the root node be the origin.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [tapspace](https://axelpale.github.io/tapspace/api/v2/).geometry.Point


Source: [getOrigin.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/getOrigin.js)

<a name="stratumgetspace"></a>
## [Stratum](#stratum):[getSpace](#stratumgetspace)()

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [tapspace](https://axelpale.github.io/tapspace/api/v2/).components.Plane


Source: [getSpace.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/getSpace.js)

<a name="stratumgetsubcontext"></a>
## [Stratum](#stratum):[getSubcontext](#stratumgetsubcontext)(node)

Get faceting context for a substratum.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *node*
  - a [StratumNode](#stratumnode)


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context) or null if the node cannot have a substratum.


Source: [getSubcontext.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/getSubcontext.js)

<a name="stratumgetsupercontext"></a>
## [Stratum](#stratum):[getSupercontext](#stratumgetsupercontext)()

Get faceting context for the superstratum.
Basically takes the stratum context, and returns a new context
with the last faceting parameter removed.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [Context](#context) or null is stratum is root.


Source: [getSupercontext.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/getSupercontext.js)

<a name="stratumnavigatetonode"></a>
## [Stratum](#stratum):[navigateToNode](#stratumnavigatetonode)(context, facetParam, facetValue)

Jump viewport to certain stratum node if such node is available.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context), defines the current stratum.
- *facetParam*
  - a string, node's faceting parameter
- *facetValue*
  - a string, node's faceting value


Source: [navigateToNode.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Sky/navigateToNode.js)

<a name="stratumnavigatetostratum"></a>
## [Stratum](#stratum):[navigateToStratum](#stratumnavigatetostratum)(context)

Jump viewport to certain stratum and load the path if needed.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context), defines the current stratum.


Source: [navigateToStratum.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Sky/navigateToStratum.js)

<a name="stratumrecomputeboundingcircle"></a>
## [Stratum](#stratum):[recomputeBoundingCircle](#stratumrecomputeboundingcircle)()

Computation of bounding circle can be heavy, thus this method
computes it at demand.

Source: [recomputeBoundingCircle.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/recomputeBoundingCircle.js)

<a name="stratumrender"></a>
## [Stratum](#stratum):[render](#stratumrender)()

A placeholder that ensures subclasses implement the render method.

Source: [render.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/render.js)

<a name="stratumscalenodestofit"></a>
## [Stratum](#stratum):[scaleNodesToFit](#stratumscalenodestofit)()

Transforms the node plane so that it fits the rendering area.

Source: [scaleNodesToFit.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/scaleNodesToFit.js)

<a name="stratumservesubstratum"></a>
## [Stratum](#stratum):[serveSubstratum](#stratumservesubstratum)(params)

A placeholder that ensures subclasses implement the method.

The purspose of serveSubstratum is to orchestrate the content of
this stratum so that its look and feel agrees with the loading state of
the substratum.

For example, use this method to visually open a category node when its
substratum is loading or loaded.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *params*
  - an object with properties:
    - *subcontext*
      - a [Context](#context)
    - *stage*
      - a string


Source: [serveSubstratum.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/serveSubstratum.js)

<a name="stratumtriggersubstratum"></a>
## [Stratum](#stratum):[triggerSubstratum](#stratumtriggersubstratum)(viewport)

A placeholder that ensures subclasses implement the method.

This method implements viewport dependent behavior
that subsequently initiates the loading of substratum if
zoom level and other viewport conditions so allow.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *viewport*
  - a [tapspace](https://axelpale.github.io/tapspace/api/v2/).components.Viewport


Source: [triggerSubstratum.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/triggerSubstratum.js)

<a name="stratumnode"></a>
## [StratumNode](#stratumnode)

Abstract class for [ArtifactNode](#artifactnode) and [CategoryNode](#categorynode).
Useful for ensuring [Sky](#sky) can handle nodes through the same interface.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *key*
  - a string, the node ID, stratum-specific
- *data*
  - an object, the node data object required for rendering.



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [StratumNode:getOrigin](#stratumnodegetorigin)
- [StratumNode:getRadius](#stratumnodegetradius)
- [StratumNode:remove](#stratumnoderemove)
- [StratumNode:render](#stratumnoderender)
- [StratumNode:setScale](#stratumnodesetscale)
- [StratumNode:translateTo](#stratumnodetranslateto)
- [StratumNode:update](#stratumnodeupdate)


Source: [StratumNode/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/StratumNode/index.js)

<a name="stratumnodegetorigin"></a>
## [StratumNode](#stratumnode):[getOrigin](#stratumnodegetorigin)()

Get node center point as a point tensor.
Useful for getting the node position in a consistent manner.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [tapspace](https://axelpale.github.io/tapspace/api/v2/).geometry.Point


Source: [getOrigin.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/StratumNode/getOrigin.js)

<a name="stratumnodegetradius"></a>
## [StratumNode](#stratumnode):[getRadius](#stratumnodegetradius)()

Get node radius as a distance tensor.
Useful for trimming edges between nodes.

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [tapspace](https://axelpale.github.io/tapspace/api/v2/).geometry.Distance


Source: [getRadius.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/StratumNode/getRadius.js)

<a name="stratumnoderemove"></a>
## [StratumNode](#stratumnode):[remove](#stratumnoderemove)()

Remove the rendered node. Useful when the graph has been filtered.

Source: [remove.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/StratumNode/remove.js)

<a name="stratumnoderender"></a>
## [StratumNode](#stratumnode):[render](#stratumnoderender)()

Render the node. A placeholder that ensures subclass implements render.

Source: [render.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/StratumNode/render.js)

<a name="stratumnodesetscale"></a>
## [StratumNode](#stratumnode):[setScale](#stratumnodesetscale)(scale)

Rescale the node.
Useful when the graph model layout has changed.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *scale*
  - a non-negative number


Source: [setScale.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/StratumNode/setScale.js)

<a name="stratumnodetranslateto"></a>
## [StratumNode](#stratumnode):[translateTo](#stratumnodetranslateto)(point)

Move the node to a position.
Useful when the graph model layout has changed.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *point*
  - a [tapspace](https://axelpale.github.io/tapspace/api/v2/).geometry.Point


Source: [translateTo.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/StratumNode/translateTo.js)

<a name="stratumnodeupdate"></a>
## [StratumNode](#stratumnode):[update](#stratumnodeupdate)(data)

Update node data and render.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *data*
  - an object


Source: [update.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/StratumNode/update.js)

<a name="timeslider"></a>
## [TimeSlider](#timeslider)

A year-range slider.


<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [TimeSlider:getElement](#timeslidergetelement)
- [TimeSlider:setRange](#timeslidersetrange)


Source: [TimeSlider/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/TimeSlider/index.js)

<a name="timeslidergetelement"></a>
## [TimeSlider](#timeslider):[getElement](#timeslidergetelement)()

Source: [getElement.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/TimeSlider/getElement.js)

<a name="timeslidersetrange"></a>
## [TimeSlider](#timeslider):[setRange](#timeslidersetrange)(yearRange)

Set slider position.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *yearRange*
  - an object { rangeStart, rangeEnd }


Source: [setRange.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/TimeSlider/setRange.js)

<a name="toolbar"></a>
## [Toolbar](#toolbar)()

A component for search and information tools.

<p style="margin-bottom: 0">Emits:</p>

- search { type, ... }
- clear { type, parameter }



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [Toolbar:getElement](#toolbargetelement)
- [Toolbar:setContext](#toolbarsetcontext)


Source: [Toolbar/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Toolbar/index.js)

<a name="toolbargetelement"></a>
## [Toolbar](#toolbar):[getElement](#toolbargetelement)()

<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)


Source: [getElement.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Toolbar/getElement.js)

<a name="toolbarsetcontext"></a>
## [Toolbar](#toolbar):[setContext](#toolbarsetcontext)(newContext)

Propagate context changes to the forms and widgets.

Source: [setContext.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Toolbar/setContext.js)

<a name="viewportmanager"></a>
## [ViewportManager](#viewportmanager)

The viewport manager handles the [tapspace](https://axelpale.github.io/tapspace/api/v2/).components.Viewport setup.
The manager can be used to enable or disable interaction.

For example, we would like to avoid user to interact with
the viewport before there is something to show.
Otherwise a few accidental moves could pan the viewport somewhere
where there will be no content.

Source: [ViewportManager/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/ViewportManager/index.js)

<a name="io"></a>
## [io](#io)

Stratocumulus client-side IO.

Gather here all code that handles sending and receiving data from
servers and databases. This helps a lot when migrating to new or
updated backend APIs.


<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [io.GraphStore](#iographstore)
- [io.LabelStore](#iolabelstore)


Source: [io/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/index.js)

<a name="iographstore"></a>
## [io](#io).[GraphStore](#iographstore)

<p style="margin-bottom: 0">Emits:</p>

- *path*
  - event with object
    - *cacheKey*
      - a string, a cache key
    - *path*
      - a string, a facet path
    - *context*
      - a [Context](#context)
    - *first*
      - a boolean
    - *final*
      - a boolean
    - *updateCount*
      - an integer, number of updates during this load.


<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *labelStore*
  - a [LabelStore](#iolabelstore). Graph store is responsible of populating the label store



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [io.GraphStore:fetch](#iographstorefetch)
- [io.GraphStore:get](#iographstoreget)
- [io.GraphStore:provide](#iographstoreprovide)
- [io.GraphStore:subscribe](#iographstoresubscribe)
- [io.GraphStore:unsubscribe](#iographstoreunsubscribe)


Source: [GraphStore/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/GraphStore/index.js)

<a name="iographstorefetch"></a>
## [io](#io).[GraphStore](#iographstore):[fetch](#iographstorefetch)(context)

Start fetching a graph with the given context.
Listens stream events.

Source: [fetch.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/GraphStore/fetch.js)

<a name="iographstoreget"></a>
## [io](#io).[GraphStore](#iographstore):[get](#iographstoreget)(context)

Get current local graph for the given context.
Return empty graph if not yet available.
The returned graph is meant for read-only use.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context)


<p style="margin-bottom: 0"><strong>Returns:</strong></p>

- a [graphology](https://graphology.github.io/).Graph.


Source: [get.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/GraphStore/get.js)

<a name="iographstoreprovide"></a>
## [io](#io).[GraphStore](#iographstore):[provide](#iographstoreprovide)(context, nodeAttrs)

Provide the graph a single node.
Useful to initiate the graph with a single node.
If the node already exists, do nothing.

Source: [provide.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/GraphStore/provide.js)

<a name="iographstoresubscribe"></a>
## [io](#io).[GraphStore](#iographstore):[subscribe](#iographstoresubscribe)(context, handler)

Subscribe to graph event stream.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context)
- *handler*
  - a function


Source: [subscribe.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/GraphStore/subscribe.js)

<a name="iographstoreunsubscribe"></a>
## [io](#io).[GraphStore](#iographstore):[unsubscribe](#iographstoreunsubscribe)(context, handler)

Unsubscribe from graph event stream.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context)
- *handler*
  - optional function


Source: [unsubscribe.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/GraphStore/unsubscribe.js)

<a name="iolabelstore"></a>
## [io](#io).[LabelStore](#iolabelstore)

This is a way to collect labels for faceted context labels.


<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [io.LabelStore:read](#iolabelstoreread)
- [io.LabelStore:write](#iolabelstorewrite)


Source: [LabelStore/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/LabelStore/index.js)

<a name="iolabelstoreread"></a>
## [io](#io).[LabelStore](#iolabelstore):[read](#iolabelstoreread)(kind, id)

Read a stored label. If label does not exist, return null.

Source: [read.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/LabelStore/read.js)

<a name="iolabelstorewrite"></a>
## [io](#io).[LabelStore](#iolabelstore):[write](#iolabelstorewrite)(kind, id, label)

Store a label.

Source: [write.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/LabelStore/write.js)

<a name="iocorporafetchartifact"></a>
## [io](#io).[corpora](#iocorpora).[fetchArtifact](#iocorporafetchartifact)(id, callback)

Fetch single artifact from the Corpora API.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *id*
  - a string, the artifact ID
- *callback*
  - a function (err, artifact)


Source: [corpora.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/corpora.js)

<a name="iocorporafetchartifactpage"></a>
## [io](#io).[corpora](#iocorpora).[fetchArtifactPage](#iocorporafetchartifactpage)(context, callback)

Fetch single page of artifacts.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context) with 'page' parameter set.
- *callback*
  - a function (err, page) where
    - *page*
      - an object { pageNumber, artifactIds }


Source: [corpora.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/corpora.js)

<a name="iocorporafetchthumbnails"></a>
## [io](#io).[corpora](#iocorpora).[fetchThumbnails](#iocorporafetchthumbnails)(callback)

Fetch federation thumbnails

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *callback*
  - a function (err, thumbnails) where
    - *thumbnails*
      - an object: federation id -> thumbnail URL


Source: [corpora.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/corpora.js)

<a name="iostreamconnect"></a>
## [io](#io).[stream](#iostream).[connect](#iostreamconnect)()

Open a SSE stream and begin to listen to events.

Source: [stream.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/stream.js)

<a name="iostreamoff"></a>
## [io](#io).[stream](#iostream).[off](#iostreamoff)(path, handler)

Unregister a path listener

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *path*
  - a string
- *handler*
  - optional handler function. If omitted, removes all handler functions for the given path.


Source: [stream.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/stream.js)

<a name="iostreamon"></a>
## [io](#io).[stream](#iostream).[on](#iostreamon)(path, handler)

Register a path listener.
The handler will be called with a subgraph object
when an event with the given path arrives.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *path*
  - *string*
- *handler*
  - function(subgraph)


Source: [stream.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/stream.js)

<a name="iostreamsendstratumbuildjob"></a>
## [io](#io).[stream](#iostream).[sendStratumBuildJob](#iostreamsendstratumbuildjob)(path, context)

Send a job to server to build a stratum.
The job result arrives later and triggers listeners for this path.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *path*
  - string, the stratum path
- *context*
  - a [Context](#context)


Source: [stream.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/io/stream.js)

<p style="text-align: right">
<a href="#top">&uarr; Back To Top</a>
</p>

