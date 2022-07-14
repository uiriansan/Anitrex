async function sendRequest(query, variables, mutation) {
    const url = 'https://graphql.anilist.co';

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    if (mutation){
        const token = localStorage.getItem('anitrex-anilist-token');

        if (!token) return console.log('AniList tokens does not exists');

        options.headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(url, options);
    } catch (err) {
        console.log(`sendRequest error: ${err}`);
    }
    
    const data = await response.json();
    return data.data;
}

function getAnimeList() {
    const user_id = localStorage.getItem('anitrex-anilist-user-id')

    const query = `
        query ($id: Int, $type: MediaType) {MediaListCollection (userId: $id, type: $type) {
            lists { name isCustomList isSplitCompletedList status entries {
                id media {
                    id idMal title { romaji english } episodes format seasonYear status source coverImage { large medium } isFavourite isAdult
                }
                status score progress repeat priority private notes hiddenFromStatusLists startedAt { year month day } completedAt { year month day } updatedAt createdAt
            }}
        }}
    `;
    const variables = {
        "id": user_id,
        "type": "ANIME"
    };

    try {
        sendRequest(query, variables, false).then(data => {
            let formated_data = {};
            let completed = [];
    
            data.MediaListCollection.lists.forEach((list, i) => {
                if (list.status === 'COMPLETED') {
                    completed.push(...list.entries);
                } else {
                    formated_data[list.status] = list.entries;
                }
            });
            formated_data['COMPLETED'] = completed;
    
            localStorage.setItem('anitrex-anime-list', JSON.stringify(formated_data));
        });
    } catch (err) {
        console.log(err);
    }
}

function updateAnimeList(anime_id, status, progress) {
    const query = `
        mutation ($mediaId: Int, $status: MediaListStatus, $progress: Int) {
            SaveMediaListEntry (mediaId: $mediaId, status: $status, progress: $progress) {
                id
                status
                progress
                media { id title { romaji english } episodes format seasonYear status source coverImage { large medium } isFavourite isAdult }
            }
        }
    `;

    const variables = {
        "mediaId": anime_id,
        "status": status,
        "progress": progress
    };

    return new Promise((resolve, reject) => {
        sendRequest(query, variables, true).then(data => {
            resolve(data.SaveMediaListEntry)
        });
    });
}

function searchForAnime(search_query) {
    const query = `
        query ($page: Int, $perPage: Int, $search: String) {
            Page (page: $page, perPage: $perPage) { pageInfo { total currentPage lastPage hasNextPage perPage }
            media (type: ANIME, search: $search) {
                id title { romaji english } format status seasonYear source coverImage { large medium } genres averageScore studios { nodes { id name isAnimationStudio } } isAdult
            }
        }}
    `;
    const variables = {
        "page": 1,
        "perPage": 2,
        "search": search_query
    };

    return new Promise((resolve, reject) => {
        sendRequest(query, variables, false).then(data => {
            resolve(data.Page.media);
        });
    });
}

function getAuthenticatedUserInfo() {
    const query = `
        query {
            Viewer {
                id name avatar { large }
            }
        }
    `;

    try {
        sendRequest(query, {}, true).then(data => { // Mutation has to be 'true' cause anilist need the access token to identify the authorized user
            localStorage.setItem('anitrex-anilist-user-name', data.Viewer.name);
            localStorage.setItem('anitrex-anilist-user-id', data.Viewer.id);
            localStorage.setItem('anitrex-anilist-user-avatar', data.Viewer.avatar.large);
        });
    } catch (err) {
        console.log(err);
    }
}