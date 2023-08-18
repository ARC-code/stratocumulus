const io = require('../io')
const template = require('./template.ejs')

// Often the referenced thumbnail for an artifact suffers from link rot, and often multiple artifacts
// share the same thumbnail, so let's keep track of any bad thumbnails to avoid wasting time trying to
// load them
const invalidCardThumbnails = []

// For keeping track of URL's for artifact archives
const archiveUrls = {}

// For keeping track of the default thumbnails for artifacts based on the federation they belong to
const federationThumbnails = {}
// let thumbnailsLoaded = false

// For mapping an agent's role to a legible label
const agentRoleMapping = window.stratocumulus.agentRoleMapping
// Capture a group of parentheses and its contents at the end of a string.
const agentRoleRegex = /(\([^)]*\))$/

// window.onload = function(event) {
//   const viewport = document.getElementById('viewport')
//
//   // A typical set of search parameters that gets passed to the backend to generate strata,
//   // plus a sorting directive to ensure we can test thumbnail functionality
//   const searchParams = {
//     'f_federations.id': '5f623f2952023c009d73107f',
//     'q': 'frankenstein',
//     's_thumbnail_url': 'desc'
//   }
//
//   makeDataPlaneCards(searchParams, viewport)
// }

// async function makeDataPlaneCards (searchParams, viewport, page = 1, pageSize = 9) {
//   const dataPlaneCardEndpoint = `${corporaApiPrefix}ArcArtifact/`
//   const dataPlaneCardSearch = Object.assign(searchParams, {
//     'page-size': pageSize,
//     page: page,
//     only: 'id'
//   })
//   const dataPlaneCardGetParams = new URLSearchParams(dataPlaneCardSearch)
//
//   if (!thumbnailsLoaded) {
//     const federationEndpoint = `${corporaApiPrefix}ArcFederation/`
//     const federationSearchParams = {
//       'page-size': 50,
//       only: 'id,thumbnail'
//     }
//     const federationGetParams = new URLSearchParams(federationSearchParams)
//
//     const response = await fetch(`${federationEndpoint}?${federationGetParams}`)
//     const data = await response.json()
//     if ('records' in data && data.records.length) {
//       data.records.forEach(fed => {
//         federationThumbnails[fed.id] = fed.thumbnail
//       })
//       thumbnailsLoaded = true
//     }
//   }
//
//   fetch(`${dataPlaneCardEndpoint}?${dataPlaneCardGetParams}`)
//     .then(response => response.json())
//     .then(data => {
//       if ('records' in data && data.records.length) {
//         data.records.forEach(record => {
//           const cardFrame = document.createElement('div')
//
//           cardFrame.setAttribute('id', `dataplane-card-${record.id}`)
//           cardFrame.setAttribute('class', 'dataplane-card')
//
//           // Here we're just appending the div to our viewport element--replace this with Tapspace
//           // placement
//           viewport.appendChild(cardFrame)
//
//           generateDataPlaneCardContent(record.id, cardFrame)
//         })
//       }
//     })
//     .catch(error => console.error(error))
// }

module.exports = function (artifactId, cardFrame) {
  console.log('generateDataPlaneCard', artifactId)

  io.corpora.fetchArtifact(artifactId, (err, art) => {
    if (err) {
      // TODO alert user?
      console.error(err)
      return
    }

    // Preprocess title
    const title = art.title

    // Preprocess thumbnail to { title, url, fallbackUrl }
    let thumbnail = null
    const primaryFederation = art.federations[0].id
    if (primaryFederation in federationThumbnails) {
      const fallbackUrl = federationThumbnails[primaryFederation]

      let thumbnailUrl = fallbackUrl
      if (art.thumbnail_url) {
        const normalizedUrl = art.thumbnail_url.replace('http:', 'https:')

        if (!invalidCardThumbnails.includes(normalizedUrl)) {
          thumbnailUrl = normalizedUrl
        }
      }

      thumbnail = {
        title: art.title,
        url: thumbnailUrl,
        fallbackUrl
      }
    }

    // Preprocess years
    let years = ''
    if (art.years.length === 1) {
      years = art.years[0]
    } else if (art.years.length > 1) {
      years = `${art.years[0]}-${art.years[art.years.length - 1]}`
    }

    // Preprocess agents to array of { role, name }
    const agents = art.agents.map(agent => {
      let name = agent.label
      let role = ''

      console.log('agent.label', name)
      const roleMatch = name.match(agentRoleRegex)
      if (roleMatch) {
        let roleCode = roleMatch[1]
        name = name.replace(roleCode, '').trim()
        roleCode = roleCode.replace('(', '').replace(')', '')
        if (roleCode in agentRoleMapping) {
          role = agentRoleMapping[roleCode]
        } else {
          role = roleCode
        }
      }

      return { name, role }
    })

    // Preprocess archive to { url, id, label }
    const archive = {
      label: art.archive.label,
      id: art.archive.id,
      url: archiveUrls[art.archive.id] || ''
    }

    // Preprocess genres and disciplines
    const genres = art.genres
    const disciplines = art.disciplines

    cardFrame.innerHTML = template({
      thumbnail,
      title,
      years,
      agents,
      archive,
      genres,
      disciplines
    })
  })
}
