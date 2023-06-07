// Use native fetch API
const fetch = window.fetch

// This string will now be passed to the client by the backend upon initial stratum rendering
const corporaApiPrefix = 'https://corpora.dh.tamu.edu/api/corpus/5f623b8eff276600a4f44553/'

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
const agentRoleMapping = {
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
  const artifactDetailEndpoint = `${corporaApiPrefix}ArcArtifact/${artifactId}/`

  fetch(artifactDetailEndpoint)
    .then(response => response.json())
    .then(art => {
      const cardHeader = document.createElement('div')
      cardHeader.setAttribute('class', 'dataplane-card-header')

      const primaryFederation = art.federations[0].id

      if (primaryFederation in federationThumbnails) {
        const thumbnail = document.createElement('img')
        thumbnail.setAttribute('class', 'dataplane-card-thumbnail')
        thumbnail.setAttribute('alt', art.title)

        if (art.thumbnail_url) {
          const adjustedThumbnailUrl = art.thumbnail_url.replace('http:', 'https:')

          if (!invalidCardThumbnails.includes(adjustedThumbnailUrl)) {
            const thumbnailErrorHandler = (event) => {
              event.target.removeEventListener('error', thumbnailErrorHandler, false)
              invalidCardThumbnails.push(event.target.getAttribute('src'))
              event.target.setAttribute('src', event.target.getAttribute('data-federation-thumbnail'))
            }
            thumbnail.setAttribute('data-federation-thumbnail', federationThumbnails[primaryFederation])
            thumbnail.addEventListener('error', thumbnailErrorHandler, false)
            thumbnail.setAttribute('src', adjustedThumbnailUrl)
          } else {
            thumbnail.setAttribute('src', federationThumbnails[primaryFederation])
          }
        } else {
          thumbnail.setAttribute('src', federationThumbnails[primaryFederation])
        }

        cardHeader.appendChild(thumbnail)
      }

      const title = document.createElement('h2')
      title.setAttribute('class', 'dataplane-card-title')
      title.innerHTML = art.title
      cardHeader.appendChild(title)
      cardFrame.appendChild(cardHeader)

      const metadata = document.createElement('dl')
      metadata.setAttribute('class', 'dataplane-card-metadata')

      // date
      const dateDt = document.createElement('dt')
      dateDt.innerHTML = 'Published'
      const dateDd = document.createElement('dd')
      if (art.years.length === 1) {
        dateDd.innerHTML = art.years[0]
      } else if (art.years.length > 1) {
        dateDd.innerHTML = `${art.years[0]}-${art.years[art.years.length - 1]}`
      }
      metadata.appendChild(dateDt)
      metadata.appendChild(dateDd)

      // agents
      art.agents.forEach(agent => {
        let name = agent.label
        let role = ''

        const roleMatch = name.match(agentRoleRegex)
        if (roleMatch !== null) {
          let roleCode = roleMatch[0]
          name = name.replace(roleCode, '').trim()
          roleCode = roleCode.replace('(', '').replace(')', '')
          if (roleCode in agentRoleMapping) {
            role = agentRoleMapping[roleCode]
          }
        }

        const roleDt = document.createElement('dt')
        roleDt.innerHTML = role
        const nameDd = document.createElement('dd')
        nameDd.innerHTML = name
        metadata.appendChild(roleDt)
        metadata.appendChild(nameDd)
      })

      // archive
      const archiveLink = document.createElement('a')
      archiveLink.innerHTML = art.archive.label
      if (art.archive.id in archiveUrls) {
        archiveLink.setAttribute('href', archiveUrls[art.archive.id])
      } else {
        archiveLink.setAttribute('data-archive-id', art.archive.id)
      }

      const archiveDt = document.createElement('dt')
      archiveDt.innerHTML = 'Site'
      const archiveDd = document.createElement('dd')
      archiveDd.appendChild(archiveLink)
      metadata.appendChild(archiveDt)
      metadata.appendChild(archiveDd)

      const genreDt = document.createElement('dt')
      genreDt.innerHTML = 'Genre(s)'
      const genreDd = document.createElement('dd')
      genreDd.innerHTML = art.genres.map(genre => genre.label).join(',')
      metadata.appendChild(genreDt)
      metadata.appendChild(genreDd)

      const disciplineDt = document.createElement('dt')
      disciplineDt.innerHTML = 'Discipline(s)'
      const disciplineDd = document.createElement('dd')
      disciplineDd.innerHTML = art.disciplines.map(discipline => discipline.label).join(',')
      metadata.appendChild(disciplineDt)
      metadata.appendChild(disciplineDd)

      cardFrame.appendChild(metadata)
    })
}
