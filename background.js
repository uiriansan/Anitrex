try {
    importScripts('src/scripts/anime.js');
} catch (err) {
    console.log(err);
}

chrome.runtime.onMessage.addListener(async function(request, sender, reply) {
    if (request.greeting === 'UPDATE_ANIME_LIST') {
        
        // TODO -> GET FROM sendMessage
        const anime_id = request.anime_id;
        const anime_status = request.anime_status;
        const anime_progress = request.anime_progress;

        const status = await updateAnimeList(anime_id, anime_status, anime_progress);
        reply(status);
    }
});