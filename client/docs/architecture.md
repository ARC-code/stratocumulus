<a name="top"></a>
# Stratocumulus Client Documentation v0.2.0


Welcome to Stratocumulus client architecture and interface documentation.

This document follows these naming conventions: `ClassName`, `namespace`, `.CONSTANT`, `.classMethod()`, `:instanceProperty`, `:instanceMethod()`, and `[optionalParameter]`.

See also: [Introduction](https://github.com/ARC-code/stratocumulus) – [Examples](https://github.com/ARC-code/stratocumulus) - [GitHub](https://github.com/ARC-code/stratocumulus)

This document is generated with [yamdog](https://github.com/axelpale/yamdog).



<a name="0stratocumulus"></a>
## [0](#0) [Stratocumulus](#0stratocumulus)

<p style="margin-bottom: 0">Components:</p>

- *Context*
- *Stratum*


Source: [client/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/index.js)

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
## [ContextForm](#contextform)

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

Source: [getElement.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Toolbar/ContextForm/getElement.js)

<a name="contextformrender"></a>
## [ContextForm](#contextform):[render](#contextformrender)()

Render the current context.

Source: [render.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Toolbar/ContextForm/render.js)

<a name="contextformsetcontext"></a>
## [ContextForm](#contextform):[setContext](#contextformsetcontext)(newContext)

Replace the context and render the new one.

Source: [setContext.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Toolbar/ContextForm/setContext.js)

<a name="stratum"></a>
## [Stratum](#stratum)

A tree graph laid on a plane.
The stratum is not yet added to the document.
Append stratum.space to a parent space in order to do that.

[Stratum](#stratum) inherits [Emitter](https://www.npmjs.com/package/component-emitter)

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context). The context gives identity to the stratum and defines the faceting and filtering of its content.


<p style="margin-bottom: 0"><a href="#stratum">Stratum</a> emits:</p>

- *first*
  - when the first node has been loaded and rendered.
- *final*
  - when all subgraphs of the stratum has been loaded and rendered.
- *substratumrequest*
  - when the stratum would like one of its nodes to be opened as
  - a new stratum.
- *layout*
  - when the stratum layout changes



<p style="margin-bottom: 0"><strong>Contents:</strong></p>


- [Stratum:filter](#stratumfilter)


Source: [Stratum/index.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/index.js)

<a name="stratumfilter"></a>
## [Stratum](#stratum):[filter](#stratumfilter)(context)

Filter the stratum by a filtering context.
This will send a new stratum build job.

<p style="margin-bottom: 0"><strong>Parameters:</strong></p>

- *context*
  - a [Context](#context). The context can include faceting parameters but only filtering parameters have effect here.


Source: [filter.js](https://github.com/ARC-code/stratocumulus/blob/main/client/lib/Stratum/filter.js)

<p style="text-align: right">
<a href="#top">&uarr; Back To Top</a>
</p>

