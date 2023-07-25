require('@tarekraafat/autocomplete.js/dist/css/autoComplete.css')
require('./searchform.css')
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

  const textBox = document.createElement('input')
  textBox.id = 'strato-autocomplete'
  this.element = textBox
  this.autocomplete = null
  this.lastAutocompleteRequest = (new Date()).getTime()
  this.autocompleteSelected = false

  // TODO These next two vars need to come from somewhere else
  // (same ones found in ArtifactCard/generateDataPlaneCardContent.js)
  const corporaApiPrefix = 'https://corpora.dh.tamu.edu/api/corpus/5f623b8eff276600a4f44553/'
  const roleMapping = {
    ART: 'Visual Artist',
    AUT: 'Author',
    EDT: 'Editor',
    PBL: 'Publisher',
    TRL: 'Translator',
    CRE: 'Creator',
    ETR: 'Etcher',
    EGR: 'Engraver',
    OWN: 'Owner',
    ARC: 'Architect',
    BND: 'Binder',
    BKD: 'Book designer',
    BKP: 'Book producer',
    CLL: 'Calligrapher',
    CTG: 'Cartographer',
    COL: 'Collector',
    CLR: 'Colorist',
    CWT: 'Commentator',
    COM: 'Compiler',
    CMT: 'Compositor',
    DUB: 'Dubious author',
    FAC: 'Facsimilist',
    ILU: 'Illuminator',
    ILL: 'Illustrator',
    LTG: 'Lithographer',
    PRT: 'Printer',
    POP: 'Printer of plates',
    PRM: 'Printmaker',
    RPS: 'Repository',
    RBR: 'Rubricator',
    SCR: 'Scribe',
    SCL: 'Sculptor',
    TYD: 'Type designer',
    TYG: 'Typographer',
    WDE: 'Wood engraver',
    WDC: 'Wood cutter'
  }

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

          // TODO: use current search params to build out this variable
          const currentFilters = ''

          const request = await fetch(`${corporaApiPrefix}ArcArtifact/suggest/?q=${query}${currentFilters}`)
          const suggestions = await request.json()
          if (currentAutocompleteRequest < sender.lastAutocompleteRequest) {
            throw Error('Stale autocomplete response')
          }
          sender.lastAutocompleteRequest = currentAutocompleteRequest

          const data = []
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
