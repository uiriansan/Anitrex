const info = document.getElementById('info');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');

const tokenSearchBox = document.getElementById('token-search-box');

const setTokenButton = document.getElementById('set-token');

const refreshLocalAnimeListBtn = document.getElementById('update-list-button');

if (localStorage.getItem('anitrex-anilist-token')) {
    info.style.display = 'block';
    addAnimeToList(20819, 'PLANNING', 0);
    userName.innerHTML = localStorage.getItem('anitrex-anilist-user-name') + ' (' + localStorage.getItem('anitrex-anilist-user-id') + ')';
    userAvatar.src = localStorage.getItem('anitrex-anilist-user-avatar');
    setTokenButton.innerHTML = '<i class="bx bx-check" ></i> Update token';
}

if (localStorage.getItem('anitrex-anime-list')) {
    refreshLocalAnimeListBtn.style.display = 'block';
}

tokenSearchBox.addEventListener('paste', (e) => {
    const t = (event.clipboardData || window.clipboardData).getData('text');
    if (t.length === 1083) {
        setTokenButton.style.display = 'flex';
    }
});

setTokenButton.addEventListener('click', (e) => {
    setTokenButton.disabled = true;
    const token = tokenSearchBox.value;
    
    localStorage.setItem('anitrex-anilist-token', token);
    getAuthenticatedUserInfo();
    getAnimeList();

    tokenSearchBox.value = '';
    setTokenButton.style.display = 'none';
    setTokenButton.disabled = false;

    const m = document.getElementById('request-message');
    m.style.color = 'green';
    m.innerHTML = 'Token updated!';
});

refreshLocalAnimeListBtn.addEventListener('click', (e) => {
    refreshLocalAnimeListBtn.disabled = true;
    getAnimeList();
    const m = document.getElementById('request-message');
    m.style.color = 'green';
    m.innerHTML = 'Local anime list updated!';
});