const info = document.getElementById('info');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');

document.getElementById('get-token').href = `https://anilist.co/api/v2/oauth/authorize?client_id=${anilist_client_id}&response_type=token`;

const tokenSearchBox = document.getElementById('token-search-box');

const setTokenButton = document.getElementById('set-token');

const refreshLocalAnimeListBtn = document.getElementById('update-list-button');

const color_picker = document.getElementById('color-picker');

if (!localStorage.getItem('anitrex-settings')) {
    const settings = {
        language: 'en',
        colors: {
            primary: '#FB6641',
            secondary: shadeColor('#FB6641', -15)
        },
        fast_search: true,
        external_search: false,
        external_search_url: {
            common: '',
            adult: ''
        },
        use_tab_title: true,
        tab_title_filters: [
            '(hd)',
            '(fhd)',
            'anime yabu',
            'AniMixPlay',
            'BetterAnime',
            'Episódio',
            'hd',
            'full hd',
            'até',
            '(TV)',
            'assistir',
            ' -'
        ],
        lists: {
            recent: true,
            watching: true,
            planning: true,
            paused: true,
            completed: true
        }
    };
    localStorage.setItem('anitrex-settings', JSON.stringify(settings));
}

let settings = JSON.parse(localStorage.getItem('anitrex-settings'));

document.getElementById('switch-fast-search').checked = settings.fast_search;
document.getElementById('switch-tab-title').checked = settings.use_tab_title;
document.getElementById('switch-external-search').checked = settings.external_search;
document.getElementById('external-search-input').disabled = !settings.external_search;
document.getElementById('adult-external-search-input').disabled = !settings.external_search;
document.getElementById('external-search-input').value = settings.external_search_url.common;
document.getElementById('adult-external-search-input').value = settings.external_search_url.adult;
document.getElementById('toggle-recent-list').checked = settings.lists.recent;
document.getElementById('toggle-watching-list').checked = settings.lists.watching;
document.getElementById('toggle-planning-list').checked = settings.lists.planning;
document.getElementById('toggle-paused-list').checked = settings.lists.paused;
document.getElementById('toggle-completed-list').checked = settings.lists.completed;

document.getElementById('switch-fast-search').addEventListener('change', (e) => {
    settings.fast_search = e.target.checked;
    localStorage.setItem('anitrex-settings', JSON.stringify(settings));
});
document.getElementById('switch-tab-title').addEventListener('change', (e) => {
    settings.use_tab_title = e.target.checked;
    localStorage.setItem('anitrex-settings', JSON.stringify(settings));
});
document.getElementById('switch-external-search').addEventListener('change', (e) => {
    settings.external_search = e.target.checked;
    localStorage.setItem('anitrex-settings', JSON.stringify(settings));
    document.getElementById('external-search-input').disabled = !settings.external_search;
    document.getElementById('adult-external-search-input').disabled = !settings.external_search;
});
document.getElementById('external-search-input').addEventListener('keyup', handleExternalSearchURLChange);
document.getElementById('adult-external-search-input').addEventListener('keyup', handleExternalSearchURLChange);
document.getElementById('set-external-search-url').addEventListener('click', (e) => {
    const common_url = document.getElementById('external-search-input').value;
    const adult_url = document.getElementById('adult-external-search-input').value;

    settings.external_search_url.common = common_url;
    settings.external_search_url.adult = adult_url;
    localStorage.setItem('anitrex-settings', JSON.stringify(settings));

    const m = document.getElementById('setting-update-external-search');
    m.style.display = 'block';
    m.innerHTML = 'External search URLs updated!';
});
document.getElementById('toggle-recent-list').addEventListener('change', toggleLists);
document.getElementById('toggle-watching-list').addEventListener('change', toggleLists);
document.getElementById('toggle-planning-list').addEventListener('change', toggleLists);
document.getElementById('toggle-paused-list').addEventListener('change', toggleLists);
document.getElementById('toggle-completed-list').addEventListener('change', toggleLists);

function toggleLists(event) {
    const list = event.target.name;
    settings.lists[list] = event.target.checked;
    localStorage.setItem('anitrex-settings', JSON.stringify(settings));
}

function handleExternalSearchURLChange(event) {
    const common_url = document.getElementById('external-search-input').value;
    const adult_url = document.getElementById('adult-external-search-input').value;

    if (common_url && adult_url && common_url.length > 0 && adult_url.length > 0) {
        const setButton = document.getElementById('set-external-search-url');
        setButton.style.display = 'block';
    } else {
        const setButton = document.getElementById('set-external-search-url');
        setButton.style.display = 'none';
    }
}

document.documentElement.style.setProperty('--primary-color', settings.colors.primary);
document.documentElement.style.setProperty('--secondary-color', settings.colors.secondary);
document.getElementById('color-code').innerHTML = settings.colors.primary.toUpperCase();
color_picker.value = settings.colors.primary;

if (localStorage.getItem('anitrex-anilist-token')) {
    info.style.display = 'flex';
    userName.innerHTML = localStorage.getItem('anitrex-anilist-user-name') + ' (' + localStorage.getItem('anitrex-anilist-user-id') + ')';
    userAvatar.src = localStorage.getItem('anitrex-anilist-user-avatar');
    setTokenButton.innerHTML = '<i class="bx bx-check" ></i> Update token';
}

if (localStorage.getItem('anitrex-anime-list')) {
    document.getElementById('update-anime-list-box').style.display = 'block';
}

drawFilters();

function drawSubmenu() {
    const selected = document.querySelector('#menu > ul > li.selected');

    if (selected) {
        document.querySelectorAll('#submenu > div').forEach((el, i) => {
            el.style.display = 'none';
        });
        const s = document.querySelector(`#submenu > #${selected.dataset.for}`);
        if (s != null) s.style.display = 'block';
    }
}

function drawFilters() {
    const list = settings.tab_title_filters;
    let el_string = '';

    list.forEach((el, i) => {
        el_string += `<div class="filter"><pre>${el}</pre><button type="button" data-entry="${i}" class="filter-remove-button"><i class="bx bxs-trash-alt"></i></button></div>`;
    });

    document.getElementById('filter-list').innerHTML = el_string;

    document.querySelectorAll('.filter-remove-button').forEach((el, i) => {
        el.addEventListener('click', (e) => {
            const entry = e.currentTarget.dataset.entry;

            if (i > -1) {
                settings.tab_title_filters.splice(entry, 1);
                localStorage.setItem('anitrex-settings', JSON.stringify(settings));
                drawFilters();
            }
        });
    });
}

tokenSearchBox.addEventListener('paste', (e) => {
    const t = (event.clipboardData || window.clipboardData).getData('text');
    if (t.length === 1083) {
        setTokenButton.style.display = 'flex';
    }
});

setTokenButton.addEventListener('click', async (e) => {
    if (tokenSearchBox.value.length > 0) {
        setTokenButton.disabled = true;
        const token = tokenSearchBox.value;
        
        localStorage.setItem('anitrex-anilist-token', token);
        getAuthenticatedUserInfo();

        tokenSearchBox.value = '';
        setTokenButton.style.display = 'none';
        setTokenButton.disabled = false;

        const m = document.getElementById('setting-update-change-token');
        m.style.display = 'block';
        m.innerHTML = 'AniList token updated!';
    }
});

refreshLocalAnimeListBtn.addEventListener('click', (e) => {
    refreshLocalAnimeListBtn.disabled = true;
    getAnimeList();
    const m = document.getElementById('setting-update-update-anime-list');
    m.style.display = 'block';
    m.innerHTML = 'Anime list updated!';
});

const filter_input = document.getElementById('filter-input');
filter_input.addEventListener('keyup', (e) => {
    if (e.key == 'Enter' && filter_input.value.length > 0) {
        settings.tab_title_filters.push(filter_input.value);
        localStorage.setItem('anitrex-settings', JSON.stringify(settings));    
        filter_input.value = '';
        drawFilters();
    }
});

function shadeColor(color, amount) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + amount) / 100);
    G = parseInt(G * (100 + amount) / 100);
    B = parseInt(B * (100 + amount) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return `#${RR}${GG}${BB}`;
}

color_picker.addEventListener('input', (e) => {
    document.getElementById('color-code').innerHTML = e.target.value.toUpperCase();
});
color_picker.addEventListener('change', (e) => {
    const new_primary_color = color_picker.value;
    let new_secondary_color = shadeColor(new_primary_color, -15);

    settings.colors.primary = new_primary_color;
    settings.colors.secondary = new_secondary_color;

    localStorage.setItem('anitrex-settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--primary-color', settings.colors.primary);
    document.documentElement.style.setProperty('--secondary-color', settings.colors.secondary);
});

document.querySelectorAll('#menu > ul > li').forEach((el, i) => {
    el.addEventListener('click', (e) => {
        document.querySelector('#menu > ul > li.selected').classList.remove('selected');
        e.currentTarget.classList.add('selected');
        drawSubmenu();
    });
});