require('./searchform.css')
const autoComplete = require('@tarekraafat/autocomplete.js')
require('@tarekraafat/autocomplete.js/dist/css/autoComplete.css')
const emitter = require('component-emitter')

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
  this.last_autocomplete_request = (new Date()).getTime()
  this.autocomplete_selected = false

  // These next two vars need to come from somewhere else (same ones found in ArtifactCard/generateDataPlaneCardContent.js)
  const corporaApiPrefix = 'https://corpora.dh.tamu.edu/api/corpus/5f623b8eff276600a4f44553/'
  const role_mapping = {
    'ART': 'Visual Artist',
    'AUT': 'Author',
    'EDT': 'Editor',
    'PBL': 'Publisher',
    'TRL': 'Translator',
    'CRE': 'Creator',
    'ETR': 'Etcher',
    'EGR': 'Engraver',
    'OWN': 'Owner',
    'ARC': 'Architect',
    'BND': 'Binder',
    'BKD': 'Book designer',
    'BKP': 'Book producer',
    'CLL': 'Calligrapher',
    'CTG': 'Cartographer',
    'COL': 'Collector',
    'CLR': 'Colorist',
    'CWT': 'Commentator',
    'COM': 'Compiler',
    'CMT': 'Compositor',
    'DUB': 'Dubious author',
    'FAC': 'Facsimilist',
    'ILU': 'Illuminator',
    'ILL': 'Illustrator',
    'LTG': 'Lithographer',
    'PRT': 'Printer',
    'POP': 'Printer of plates',
    'PRM': 'Printmaker',
    'RPS': 'Repository',
    'RBR': 'Rubricator',
    'SCR': 'Scribe',
    'SCL': 'Sculptor',
    'TYD': 'Type designer',
    'TYG': 'Typographer',
    'WDE': 'Wood engraver',
    'WDC': 'Wood cutter'
  }

  this.agent_role_regex = new RegExp(`(\\([^\\)]*\\))$`)
  this.parse_agent_string = (agent) => {
    let name = '';
    let role = '';
    let role_match = agent.match(this.agent_role_regex);
    if (role_match !== null) {
      let role_string = role_match[0];
      name = agent.replace(role_string, '').trim();
      role = role_string.replace('(', '').replace(')', '');
    } else
      name = agent;

    return [name, role];
  }

  this.configure = () => {
    let sender = this

    // Initialize the autocomplete component (must happen after element is mounted to the DOM)
    sender.autocomplete = new autoComplete({
      selector: '#strato-autocomplete',
      data: {
        src: async (query) => {
          const current_autocomplete_request = (new Date()).getTime();

          // TODO: use current search params to build out this variable
          let current_filters = ''

          const request = await fetch(`${corporaApiPrefix}ArcArtifact/suggest/?q=${query}${current_filters}`)
          const suggestions = await request.json()
          if (current_autocomplete_request < sender.last_autocomplete_request) throw Error("Stale autocomplete response")
          sender.last_autocomplete_request = current_autocomplete_request

          let data = [];
          Object.keys(suggestions).map(field => {
            suggestions[field].map(suggestion => data.push({suggestion: suggestion, field: field}));
          });
          return data;
        },
        keys: ['suggestion'],
      },
      threshold: 2,
      resultsList: {
        maxResults: 10
      },
      resultItem: {
        element: (item, data) => {
          let item_label = data.match;
          let field_label = data.value.field;

          if (field_label === 'agents') {
            let [name, role] = sender.parse_agent_string(item_label);
            if (role in role_mapping)
              role = role_mapping[role];
            item_label = `${name} (${role})`;
            field_label = 'PERSON';
          }

          item.style = "display: flex; justify-content: space-between;";
          item.innerHTML = `
                            <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${item_label}</span>
                            <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.5);">${field_label}</span>
                        `;
        },
        highlight: true
      },
      searchEngine: (query, record) => {
        let mark_start = record.toLowerCase().indexOf(query.toLowerCase());
        if (mark_start > -1) {
          return record.slice(0, mark_start) + '<mark>' + record.slice(mark_start, query.length + mark_start) + '</mark>' + record.slice(query.length + mark_start, record.length);
        } else return record;
      },
      events: {
        input: {
          focus: () => {
            if (sender.element.value.length) sender.autocomplete.start();
          }
        }
      }
    })

    // The event that gets fired when a user selects a dropdown autocomplete suggestion
    sender.element.addEventListener('selection', function(event) {
      sender.autocomplete_selected = true
      let suggestion = event.detail.selection.value.suggestion
      let suggestion_field = event.detail.selection.value.field
      let searchParams = {}

      if (suggestion_field === 'title') {
        searchParams[`f_${suggestion_field}`] = suggestion
      } else if (suggestion_field === 'agents') {
        let [name, role] = sender.parse_agent_string(suggestion)
        searchParams[`f_${suggestion_field}.label.raw`] = suggestion
      }

      sender.element.value = ''
      sender.emit('submit', searchParams)
    })

    // The event that gets fired when a user hits enter in the search box
    sender.element.addEventListener('keyup', function(event) {
      if (sender.autocomplete_selected) sender.autocomplete_selected = false
      else if (event.key === "Enter") {
        sender.emit('submit', { q: sender.element.value })
      }
    })
  }
  /*
  const form = document.createElement('form')
  form.className = 'search-box'
  form.action = '#' // no-op

  form.innerHTML = [
    '<input type="text" tabindex="0" class="search-text" placeholder="Search" />',
    '<button type="submit" tabindex="0" class="search-button" aria-label="Go">',
    '<span aria-hidden="true" focusable="false">&#128269;</span>',
    '</button>'
  ].join('')

  this.element = form

  form.addEventListener('submit', (ev) => {
    // Prevent page reload
    ev.preventDefault()

    const query = form.querySelector('.search-text').value.trim()

    if (query.length > 0) {
      this.emit('submit', {
        query: query
      })
    }
  })
  */
}

module.exports = SearchForm
const proto = SearchForm.prototype

// Inherit
emitter(proto)

// Methods
proto.getElement = require('./getElement')

