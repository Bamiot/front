const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const searchResults = document.querySelector('#search-results')
const popupContainer = document.querySelector('#popup-container')

const resultsItemExemple = {
  type: 'song',
  videoId: 'wpHyuWikAP4',
  playlistId: 'RDAMVMwpHyuWikAP4',
  name: 'ÇA VA ENSEMBLE',
  artist: {
    name: 'Alpha Wann',
    browseId: 'UCczJMmccv1lIhMVkZ1FBCSQ'
  },
  album: {
    name: 'Alpha Wann',
    browseId: 'UCczJMmccv1lIhMVkZ1FBCSQ'
  },
  duration: 419000,
  thumbnails: [
    {
      url: 'https://lh3.googleusercontent.com/rpPkq2aWHp0vnq9cvXFCJTFX0b5RJCM_uZwyo4l_nT3-c__QSso1IlOY70H9i9EmL4vkVl4i18vbD_zq=w60-h60-l90-rj',
      width: 60,
      height: 60
    },
    {
      url: 'https://lh3.googleusercontent.com/rpPkq2aWHp0vnq9cvXFCJTFX0b5RJCM_uZwyo4l_nT3-c__QSso1IlOY70H9i9EmL4vkVl4i18vbD_zq=w120-h120-l90-rj',
      width: 120,
      height: 120
    }
  ],
  params: 'wAEB'
}

// global variables
let isSearching = false
let results = []
let selectedResult
let playlistData

getPlaylists()

// get playlist data from server at localhost:3000/playlists
function getPlaylists() {
  fetch('http://localhost:3008/playlists')
    .catch(err => console.log(err))
    .then(res => res.json())
    .then(data => {
      playlistData = data
    })
}

// clear search results
function clearResults() {
  searchResults.innerHTML = ''
}

// handle search form submission
searchForm.addEventListener('submit', e => {
  e.preventDefault()
  search()
})

// search sound by name or artist via youtube api and display results
function search() {
  const searchTerm = searchInput.value
  if (searchTerm !== '') {
    const url = `http://localhost:3008/search?query=${searchTerm}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        results = data.content
        displayResults()
      })
  }
}

// display results in DOM
function displayResults() {
  clearResults()
  results.forEach((result, index) => {
    const li = document.createElement('li')
    const figure = document.createElement('figure')
    const img = document.createElement('img')
    const h2 = document.createElement('h2')
    const p = document.createElement('p')
    const figcaption = document.createElement('figcaption')
    li.classList.add('result-item')
    li.setAttribute('data-index', index)
    img.src = result.thumbnails[1].url
    img.alt = 'thumbnail'
    h2.innerText = result.name
    p.innerText = result.artist.name
    figcaption.appendChild(h2)
    figcaption.appendChild(p)
    figure.appendChild(img)
    figure.appendChild(figcaption)
    li.appendChild(figure)
    searchResults.appendChild(li)
  })
}

// handle click on search result
searchResults.addEventListener('click', e => {
  const clickedResult = e.target.closest('.result-item')
  if (clickedResult) {
    const dataIndex = clickedResult.getAttribute('data-index')
    selectedResult = results[dataIndex]
    showPopup(selectedResult)
  }
})

// show popup with song info
function showPopup(result) {
  const popup = document.createElement('div')
  const img = document.createElement('img')
  const h2 = document.createElement('h2')
  const p = document.createElement('p')
  const close = document.createElement('span')
  const playListForm = document.createElement('form')
  const submitButton = document.createElement('button')
  submitButton.innerText = 'Add to playlist'
  submitButton.setAttribute('type', 'submit')
  playListForm.onsubmit = addToPlaylist
  popup.classList.add('popup')
  close.classList.add('close')
  close.innerText = 'X'
  img.src = result.thumbnails[1].url
  img.alt = 'thumbnail'
  h2.innerText = result.name
  p.innerText = result.artist.name
  playListForm.appendChild(getPlaylistSelector())
  playListForm.appendChild(submitButton)
  popup.appendChild(close)
  popup.appendChild(img)
  popup.appendChild(h2)
  popup.appendChild(p)
  popup.appendChild(playListForm)
  popupContainer.appendChild(popup)
  popupContainer.classList.add('show')
  close.addEventListener('click', closePopup)
}

function closePopup() {
  popupContainer.innerHTML = ''
  popupContainer.classList.remove('show')
}

function getPlaylistSelector() {
  const playlistSelector = document.createElement('select')
  playlistSelector.classList.add('playlist-selector')
  playlistSelector.setAttribute('id', 'playlist-selector')
  playlistSelector.setAttribute('name', 'playlist-selector')
  const option = document.createElement('option')
  option.innerText = 'Select Playlist'
  option.value = ''
  playlistSelector.appendChild(option)
  playlistData.forEach(playlist => {
    const option = document.createElement('option')
    option.innerText = playlist.name
    option.value = playlist.name
    playlistSelector.appendChild(option)
  })
  return playlistSelector
}

// show confirmation popup when song is added to playlist
function showConfirmation() {
  closePopup()
  const popup = document.createElement('div')
  const h2 = document.createElement('h2')
  const p = document.createElement('p')
  const close = document.createElement('span')
  const playlistButton = document.createElement('a')
  popup.classList.add('popup')
  close.classList.add('close')
  close.innerText = 'X'
  playlistButton.innerText = 'Go to playlist'
  playlistButton.classList.add('button')
  playlistButton.setAttribute('href', `./pages/playlists.html`)
  h2.innerText = 'Song added to playlist'
  p.innerText = 'You can find it in your playlist'
  popup.appendChild(close)
  popup.appendChild(h2)
  popup.appendChild(p)
  popup.appendChild(playlistButton)
  popupContainer.appendChild(popup)
  popupContainer.classList.add('show')
  close.addEventListener('click', closePopup)
}

function showError(error) {
  console.log(error)
  closePopup()
  const popup = document.createElement('div')
  const h2 = document.createElement('h2')
  const p = document.createElement('p')
  const close = document.createElement('span')
  popup.classList.add('popup')
  close.classList.add('close')
  close.innerText = 'X'
  h2.innerText = 'Error\nSomething went wrong, please try later'
  p.innerText = `${error}`
  popup.appendChild(close)
  popup.appendChild(h2)
  popup.appendChild(p)
  popupContainer.appendChild(popup)
  popupContainer.classList.add('show')
  close.addEventListener('click', closePopup)
}

async function addToPlaylist(e) {
  e.preventDefault()
  const playlist = document.querySelector('#playlist-selector').value
  if (playlist !== '') {
    const songData = JSON.stringify(selectedResult)
    const url = `http://localhost:3008/song?playlist=${playlist}`
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: songData
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'ok') showConfirmation()
        else showError(data.message)
      })
  }
}
