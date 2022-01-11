const rootElement = document.getElementById('root-list')
const popupContainer = document.querySelector('#popup-container')

let playlistData

  // get playlist data from server at localhost:3000/playlists
;(function getPlaylists() {
  fetch('http://localhost:3008/playlists')
    .catch(err => console.log(err))
    .then(res => res.json())
    .then(data => {
      playlistData = data
      renderPlaylistsCard()
    })
})()

function renderPlaylistsCard() {
  playlistData.forEach((playlist, index) => {
    const playlistCard = document.createElement('div')
    const playlistTitle = document.createElement('h2')
    const playlistDescription = document.createElement('p')
    playlistCard.classList.add('playlist-card')
    playlistCard.setAttribute('data-index', index)
    playlistTitle.innerText = playlist.name
    playlistDescription.innerText = playlist.description || playlist.name
    playlistCard.appendChild(playlistTitle)
    playlistCard.appendChild(playlistDescription)
    playlistCard.addEventListener('click', () => showPopup(playlist))
    rootElement.appendChild(playlistCard)
  })
}

function showPopup(playlist) {
  const popup = document.createElement('div')
  const h2 = document.createElement('h2')
  const close = document.createElement('span')
  const links = document.createElement('div')
  links.classList.add('links')
  popup.classList.add('popup')
  close.classList.add('close')
  close.innerText = 'X'
  h2.innerText = playlist.name
  popup.appendChild(close)
  popup.appendChild(h2)

  playlist.links.forEach(link => {
    const a = document.createElement('a')
    a.innerText = link.name
    a.setAttribute('href', link.url)
    a.classList.add('link')
    links.appendChild(a)
  })
  popup.appendChild(links)
  popupContainer.appendChild(popup)
  popupContainer.classList.add('show')
  close.addEventListener('click', closePopup)
}

function closePopup() {
  popupContainer.innerHTML = ''
  popupContainer.classList.remove('show')
}
