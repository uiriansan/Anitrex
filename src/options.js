const info = document.querySelector('.info');
const userIDP = document.getElementById('user-id');

const tokenSearchBox = document.getElementById('token-search-box');

const setTokenButton = document.getElementById('set-token');

const refreshLocalAnimeListBtn = document.getElementById('update-list-button');

if (localStorage.getItem('user-id')) {
    info.style.display = 'block'
    userIDP.innerHTML = 'Current User ID: ' + localStorage.getItem('user-id');
    setTokenButton.innerHTML = '<i class="bx bx-check" ></i> Update token';
}

if (localStorage.getItem('anime-list')) {
    refreshLocalAnimeListBtn.style.display = 'block';
}

tokenSearchBox.addEventListener('paste', (e) => {
    const t = (event.clipboardData || window.clipboardData).getData('text');
    if (t.length === 1083) {
        setTokenButton.style.display = 'flex';
    }
});

function getAnimeList() {
    const id = localStorage.getItem('user-id');
    const url = 'http://localhost:3333/anime-list?id=' + id;

    const m = document.getElementById('request-message');
    fetch(url).then((response) => response.json())
    .then((data) => {
        localStorage.setItem('anime-list', JSON.stringify(data.animes));
        m.style.color = 'green';
        m.innerHTML = 'Local anime list updated!';
    })
    .catch((err) => {
        console.log(err);
    });
}

setTokenButton.addEventListener('click', (e) => {
    setTokenButton.disabled = true;
    const token = tokenSearchBox.value;
    
    if (localStorage.getItem('user-id')) {
        // UPDATE EXISTING TOKEN
        const url = 'http://127.0.0.1:3333/update-token?token='+token+'&id='+localStorage.getItem('user-id');
        
        fetch(url).then((response) => response.json())
        .then((data) => {
            const m = document.getElementById('request-message')
            if (data.status === 200) {
                tokenSearchBox.value = '';
                setTokenButton.style.display = 'none';
                setTokenButton.disabled = false;
                m.style.color = 'green';
                m.innerHTML = 'Token updated!';
            } else {
                m.style.color = 'red';
                m.innerHTML = `Server responded with an error (${data.status}). Try again!`
            }
        })
        .catch((err) => {
            console.log(err)
        });
    } else {
        // SET NEW TOKEN
        const url = 'http://127.0.0.1:3333/set-token?token='+token;

        fetch(url).then((response) => response.json())
        .then((data) => {
            const m = document.getElementById('request-message');
            if (data.status === 200) {
                tokenSearchBox.value = '';
                setTokenButton.style.display = 'none';
                setTokenButton.disabled = false;
                m.style.color = 'green';
                m.innerHTML = 'Token saved!';
                localStorage.setItem('user-id', data.user_id);
                getAnimeList();
            } else {
                m.style.color = 'red';
                m.innerHTML = `Server responded with an error (${data.status}). Try again!`
            }
        })
        .catch((err) => {
            console.log(err)
        });
    }
});

refreshLocalAnimeListBtn.addEventListener('click', (e) => {
    refreshLocalAnimeListBtn.disabled = true;
    getAnimeList();
});