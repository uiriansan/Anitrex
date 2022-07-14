if (!localStorage.getItem('anitrex-anilist-token')) {
    document.querySelector('main#popup > *').style.display = 'none';
    document.querySelector('main#popup').style.height = '100px';
    document.querySelector('main#popup').innerHTML = '<div class="text-center white-bold align-center">Setup your AniList token first!</div>'
}

const searchBox = document.getElementById('anitrex-search-box');
const searchResults = document.getElementById('search-results');
const currentAnimeContainer = document.getElementById('current-anime-container');

const loader = document.getElementById('loader');
var clickTimeout;

function findAnimeInLocalList(anime_id) {
    const anime_list = JSON.parse(localStorage.getItem('anime-list'));
    var list = null;

    Object.values(anime_list).forEach(val => {
        const t = val.find(x => x.media.id === anime_id);
        if (t) {
            list = t.status;
        }
    });
    return list;
}

function getSearchResults() {
    const query = searchBox.value;

    if (query.length === 0) {
        loader.style.display = 'block';
        searchResults.style.padding = '0';
        searchResults.innerHTML = '';
        return;
    }

    const id = localStorage.getItem('user-id');
    const url = `http://localhost:3333/anime-search?id=${id}&q=${query}`;

    fetch(url).then((response) => response.json())
        .then((data) => {
            if (data.status === 200) {
                if (data.animes.length === 0) {
                    searchResults.style.padding = '15px';
                    searchResults.innerHTML = `<div class="text-center">No results for '${query}'</div>`;
                    return;
                }

                loader.style.display = 'none';
                var elementString = '';

                data.animes.forEach((anime, i) => {
                    var overlay = '';
                    const local_anime_list = findAnimeInLocalList(anime.id);

                    if (local_anime_list != null) {
                        overlay = `<span>Already added to <span class="orange">⋅${local_anime_list}⋅</span></span>`;
                    } else if (anime.status === 'NOT_YET_RELEASED') {
                        overlay = `
                            <button class="overlay-button" title="Add anime to ⋅PLANNING⋅" data-anime="${anime.id}" data-status="PLANNING")"><i class='bx bx-list-plus'></i></button>
                        `
                    } else {
                        overlay = `
                            <button class="overlay-button" title="Add anime to ⋅PLANNING⋅" data-anime="${anime.id}" data-status="PLANNING"><i class='bx bx-list-plus'></i></button>
                            <button class="overlay-button" title="Add anime to ⋅CURRENT⋅ and set first episode as watched" data-anime="${anime.id}" data-status="CURRENT"><i class="bx bx-plus-circle"></i></button>
                        `
                    }

                    elementString = elementString + `
                    <div class="anime-result">
                        <div class="anime-result-image" style="background-image: url(${anime.coverImage.large})"></div>
                        <div class="anime-result-info">
                            <h2 class="anime-title">${anime.title.romaji}</h2>
                            <h4 class="anime-title-english">${anime.title.english=== anime.title.romaji || anime.title.english == null ? '' : anime.title.english}</h4>
                            <p class="anime-format">${anime.format != null ? anime.format : 'N/A'} - ${anime.seasonYear != null ? anime.seasonYear : 'N/A'} | ${toTitleCase(anime.status)}</p>
                            <p class="anime-score"><i class='bx bxs-star'></i> ${anime.averageScore == null ? 'N/A' : anime.averageScore} | ${anime.studios.nodes.length !== 0 ? anime.studios.nodes[0].name : 'N/A'} | ${anime.source == null ? '' : toTitleCase(anime.source.replace('_', ' '))}</p>
                            <p class="anime-genres">${anime.isAdult ? '<span class="is-anime-adult">NSFW</span>' : ''}${anime.genres.join(' • ')}</p>
                        </div>
                        <div class="anime-result-overlay">
                            ${overlay}
                        </div>
                    </div>`;
                });
                searchResults.style.padding = '15px';
                searchResults.innerHTML = elementString;

                const overlay_buttons = document.querySelectorAll('.overlay-button');
                overlay_buttons.forEach((el, i) => {
                    el.addEventListener('click', addAnimeToList);
                });
            } else {
                searchResults.style.padding = '15px';
                searchResults.innerHTML = data.status + ' | ' + data.err;
            }
        })
        .catch((err) => {
            searchResults.innerHTML = err;
        });
}

// *DONE
async function addAnimeToListtttttttttttttttt(event) {
    const t = event.currentTarget;
    t.disabled = true;
    t.innerHTML = '<i class="bx bx-dots-horizontal-rounded"></i>';
    const status = event.currentTarget.dataset.status;
    const anime_id = event.currentTarget.dataset.anime;
    const progress = status === 'CURRENT' ? 1 : 0;

    const response = await addAnimeToList(anime_id, status, progress);

    /*
        anime -> response.media
        status -> response.status
    */

    // fetch(url).then((response) => response.json())
    //     .then((data) => {
    //         if (data.status === 200) {
    //             t.innerHTML = '<i class="bx bx-check"></i>';

    //             var local_anime_list = JSON.parse(localStorage.getItem('anime-list'));
    //             local_anime_list[data.list_entry.status].push(data.list_entry);
    //             localStorage.setItem('anime-list', JSON.stringify(local_anime_list));

    //             if (data.list_entry.status === 'CURRENT') {
    //                 localStorage.setItem('current-anime', JSON.stringify(data.list_entry));
    //                 getCurrentAnime();
    //             }
    //         } else {
    //             t.innerHTML = '<i class="bx bx-error-circle"></i>';
    //             t.disabled = true;
    //             console.log(data);
    //         }
    //     })
    //     .catch((err) => {
    //         t.innerHTML = '<i class="bx bx-error-circle"></i>';
    //         t.disabled = true;
    //         console.log(err);
    //     });
}

document.addEventListener('DOMContentLoaded', async (e) => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    let result;
    try {
        [{result}] = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: () => getSelection().toString(),
        });
    } catch (e) {
        return;
    }
    searchBox.value = result;

    if (result.length > 0) getSearchResults();
    getCurrentAnime(tab.title);
});

searchBox.onkeyup = delay((e) => {
    searchResults.style.padding = '15px';
    loader.style.display = 'block';
    getSearchResults();
}, 500);

function getBigrams(str) {
    const bigrams = new Set();
    for (let i = 0; i < str.length - 1; i += 1) {
        bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
}

function intersect(set1, set2) {
    return new Set([...set1].filter((x) => set2.has(x)));
}

function diceCoefficient(str1, str2) {
    const bigrams1 = getBigrams(str1);
    const bigrams2 = getBigrams(str2);
    return (2 * intersect(bigrams1, bigrams2).size) / (bigrams1.size + bigrams2.size);
}

function getCurrentAnime(tab_title) {
    var current_anime = {};
    if (tab_title && tab_title.length > 0) {
        const anime_list = JSON.parse(localStorage.getItem('anime-list'));
        var anime = {};
        var max_similarity = 0;

        Object.values(anime_list).forEach(val => {
            for (let i = 0; i < val.length; i++) {
                // Tested with 'Dice Coefficient' and 'Levenshtein distance'. BOTH SUCKS.
                // diceCoefficient('Arquivos Naruto - Anime Yabu', 'NARUTO') === 0 ??????????????????????????, and with lowercase "naruto" === 0.32
                //TODO-> https://stackoverflow.com/questions/3576211/what-string-similarity-algorithms-are-there
                const sim = diceCoefficient(tab_title.toLowerCase(), val[i].media.title.romaji.toLowerCase());

                if (sim > 0.35 && sim > max_similarity) {
                    max_similarity = sim;
                    anime = val[i];
                }
            }
        });

        if (Object.keys(anime).length === 0) {
            getCurrentAnime();
        } else {
            current_anime = anime;
        }
    } else if (localStorage.getItem('current-anime')) {
        current_anime = JSON.parse(localStorage.getItem('current-anime'));
    } else {
        current_anime = JSON.parse(localStorage.getItem('anime-list'))['CURRENT'][0];
    }

    const decButtonString = `
        <button title="Decrement episodes" class="episode-button" id="current-anime-decrement-episodes" data-anime="${current_anime.media.id}" data-operation="DECREMENT" data-status="${current_anime.status}" data-progress="${current_anime.progress}" data-total="${current_anime.media.episodes}" ${current_anime.progress === 0 ? 'disabled' : ''}><i class="bx bx-minus"></i></button>
    `;
    const incButtonString = `
        <button title="Increment episodes" class="episode-button" id="current-anime-increment-episodes" data-anime="${current_anime.media.id}" data-operation="INCREMENT" data-status="${current_anime.status}" data-progress="${current_anime.progress}" data-total="${current_anime.media.episodes}" ${current_anime.progress === current_anime.media.episodes ? 'disabled' : ''}><i class="bx bx-plus"></i></button>
    `;

    const elementString = `
    <div class="anime-result-image" style="background-image: url(${current_anime.media.coverImage.large})"></div>
    <div id="current-anime-info">
        <div id="current-anime-titles">
            <h2 id="current-anime-romaji-title">${current_anime.media.title.romaji}</h2>
            <h4 id="current-anime-english-title">${current_anime.media.title.english === null || current_anime.media.title.romaji.length > 36 ? '' : current_anime.media.title.english}</h4>
            <p id="current-anime-format">${current_anime.media.format != null ? current_anime.media.format : 'N/A'} - ${current_anime.media.seasonYear != null ? current_anime.media.seasonYear : 'N/A'} | ${toTitleCase(current_anime.media.status)}</p>
        </div>

        ${current_anime.media.episodes && current_anime.media.episodes != null ? '<div id="current-anime-episodes-controls">'+decButtonString+'<div><span id="current-anime-watched-episodes">'+current_anime.progress+'</span><span id="current-anime-total-episodes">/'+current_anime.media.episodes+'</span></div>'+incButtonString+'</div>' : ''}
    </div>
    `;
    currentAnimeContainer.innerHTML = elementString;

    document.querySelectorAll('.episode-button').forEach((el, i) => {
        el.addEventListener('click', currentAnimeEpisodeOperation);
    });
}

function currentAnimeEpisodeOperation(event) {
    clearTimeout(clickTimeout);

    const t = event.currentTarget;
    const operation = t.dataset.operation;
    const anime_id = t.dataset.anime;
    const progress = Number(t.dataset.progress);
    const total = Number(t.dataset.total);

    var status = t.dataset.status;
    var new_progress = progress;

    if (operation === 'INCREMENT') {
        new_progress = progress + 1;

        if (progress === 0) {
            const control_parent = t.parentElement;
            control_parent.querySelector('.episode-button[data-operation="DECREMENT"]').disabled = false;
        }

        if (progress+1 === total) {
            // Move to completed
            status = 'COMPLETED';
            // Disable button
            t.disabled = true;
        }
    } else {
        new_progress = progress - 1;

        if (progress === total) {
            const control_parent = t.parentElement;
            control_parent.querySelector('.episode-button[data-operation="INCREMENT"]').disabled = false;
        }

        if (progress-1 === 0) {
            // Move to planning
            status = 'PLANNING';

            // Disable button
            t.disabled = true;
        }
    }

    console.log(`${new_progress} - ${status}`);

    const control_parent = t.parentElement;

    // Update buttons progress data
    control_parent.querySelectorAll('button.episode-button').forEach((el, i) => {
        el.dataset.progress = new_progress;
    });

    // Update counter
    const watched_episode_counter = control_parent.querySelector('div > #current-anime-watched-episodes');
    watched_episode_counter.innerHTML = new_progress;

    clickTimeout = setTimeout(function() {
        console.log(new_progress);

        // TODO todo todo todo todo todo
        // const user_id = localStorage.getItem('user-id');
        // const url = `http://localhost:3333/anime-add-to-list?id=${user_id}&anime=${anime_id}&status=${status}&progress=${new_progress}`;

        // fetch(url).then((response) => response.json())
        //     .then((data) => {
        //         if (data.status === 200) {
                    
        //         } else {
                    
        //             console.log(data);
        //         }
        //     })
        //     .catch((err) => {
                
        //         console.log(err);
        //     });
    }, 500);
}

// Delayed events
function delay(fn, ms) {
    let timer = 0;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(fn.bind(this, ...args), ms || 0);
    };
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}