require('@tarekraafat/autocomplete.js/dist/css/autoComplete.css')
require('./searchform.css')
const Context = require('../../Context')
const AutoComplete = require('@tarekraafat/autocomplete.js')
const emitter = require('component-emitter')
const fetch = window.fetch

const SearchForm = function () {
  // A search bar and a submit button
  //
  // Emits
  //   submit
  //     when a non-empty search keyword is submitted
  //

  // Current context for SearchForm.
  // The main context change listener at the app index is responsible
  // to call SearchForm:setContext whenever the context changes.
  this.ctx = new Context()

  // Construct input element
  const textBox = document.createElement('input')
  textBox.id = 'strato-autocomplete'
  this.element = textBox

  // Autocompletion
  this.autocomplete = null
  this.lastAutocompleteRequest = (new Date()).getTime()
  this.autocompleteSelected = false

  const corporaApiPrefix = window.stratocumulus.corporaApiPrefix
  const roleMapping = window.stratocumulus.agentRoleMapping

  this.agentRoleRegex = /(\([^)]*\))$/ // Find last parentheses content
  this.parseAgentString = (agent) => {
    let name = ''
    let role = ''
    const roleMatch = agent.match(this.agentRoleRegex)
    if (roleMatch !== null) {
      const roleString = roleMatch[0]
      name = agent.replace(roleString, '').trim()
      role = roleString.replace('(', '').replace(')', '')
    } else {
      name = agent
    }

    return [name, role]
  }

  this.configure = () => {
    const sender = this

    // Initialize the autocomplete component (must happen after element is mounted to the DOM)
    sender.autocomplete = new AutoComplete({
      selector: '#strato-autocomplete',
      data: {
        src: async (query) => {
          const currentAutocompleteRequest = (new Date()).getTime()

          // Apply the current context to filter the autocomplete results.
          // See lib/Context/toQueryString for details.
          let currentFilters = sender.ctx.toQueryString()
          if (currentFilters.length > 0) {
            currentFilters = '&' + currentFilters
          }

          // Request autocomplete suggestions from Corpora's "suggest" API,
          // storing results in "suggestions"
          const requestPath = `${corporaApiPrefix}ArcArtifact/suggest/`
          const requestUrl = `${requestPath}?q=${query}${currentFilters}`
          const request = await fetch(requestUrl)
          const suggestions = await request.json()
          if (currentAutocompleteRequest < sender.lastAutocompleteRequest) {
            throw Error('Stale autocomplete response')
          }
          sender.lastAutocompleteRequest = currentAutocompleteRequest

          // Initialize array for keeping track of suggestions
          const data = []

          // Query DOM for nodes on current stratum matching user query to add to suggestions
          const qs = 'div.current-stratum div.node-shape[data-facetparam]'
          const navigableNodes = document.querySelectorAll(qs)
          navigableNodes.forEach(n => {
            const label = n.getAttribute('data-label')
            if (label.toLowerCase().includes(query.toLowerCase())) {
              data.push({
                suggestion: label,
                field: n.getAttribute('data-kind')
              })
            }
          })

          // Add to suggestions any results from Corpora "suggest" API
          Object.keys(suggestions).forEach(field => {
            suggestions[field].forEach(suggestion => {
              data.push({
                suggestion: suggestion,
                field: field
              })
            })
          })
          return data
        },
        keys: ['suggestion']
      },
      threshold: 2,
      resultsList: {
        maxResults: 10
      },
      resultItem: {
        element: (item, data) => {
          let itemLabel = data.match
          let fieldLabel = data.value.field

          if (fieldLabel === 'agents') {
            let [name, role] = sender.parseAgentString(itemLabel)
            if (role in roleMapping) {
              role = roleMapping[role]
            }
            itemLabel = `${name} (${role})`
            fieldLabel = 'PERSON'
          }

          if (fieldLabel.endsWith('s')) fieldLabel = fieldLabel.substring(0, fieldLabel.length - 1)

          item.style = 'display: flex; justify-content: space-between;'
          item.innerHTML = `
                            <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${itemLabel}</span>
                            <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.5);">${fieldLabel}</span>
                        `
        },
        highlight: true
      },
      searchEngine: (query, record) => {
        const markStart = record.toLowerCase().indexOf(query.toLowerCase())
        if (markStart > -1) {
          return record.slice(0, markStart) + '<mark>' + record.slice(markStart, query.length + markStart) + '</mark>' + record.slice(query.length + markStart, record.length)
        }
        return record
      },
      events: {
        input: {
          focus: () => {
            if (sender.element.value.length) {
              sender.autocomplete.start()
            }
          }
        }
      }
    })

    // The event that gets fired when a user selects a dropdown autocomplete suggestion
    sender.element.addEventListener('selection', (event) => {
      sender.autocompleteSelected = true
      const suggestion = event.detail.selection.value.suggestion
      const suggestionField = event.detail.selection.value.field
      sender.element.value = ''

      // Send filtering actions towards the reducer.
      // The reducer is responsible of handling the exact query parameters.
      if (suggestionField === 'title') {
        sender.emit('submit', {
          type: 'filter/title',
          title: suggestion
        })
      } else if (suggestionField === 'agents') {
        // let [name, role] = sender.parseAgentString(suggestion)
        sender.emit('submit', {
          type: 'filter/person',
          name: suggestion
        })
      } else {
        // Assuming now that suggestion is a navigable facet node,
        // find matching node in DOM and retrieve
        // facet param and facet value necessary for navigation
        const navNode = document.querySelector(`div.current-stratum div.node-shape[data-kind='${suggestionField}'][data-label='${suggestion}']`)

        sender.emit('submit', {
          type: 'navigation/node',
          parameter: navNode.getAttribute('data-facetparam'),
          value: navNode.getAttribute('data-facetvalue')
        })
      }
    })

    // The event that gets fired when a user hits enter in the search box
    sender.element.addEventListener('keyup', (event) => {
      if (sender.autocompleteSelected) {
        sender.autocompleteSelected = false
      } else if (event.key === 'Enter') {
        sender.emit('submit', {
          type: 'filter/keyword',
          keyword: sender.element.value
        })
      }
    })
  }
}

module.exports = SearchForm
const proto = SearchForm.prototype

// Inherit
emitter(proto)

// Methods
proto.getElement = require('./getElement')
proto.setContext = require('./setContext')
