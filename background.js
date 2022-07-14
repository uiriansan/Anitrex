try {
    importScripts('src/scripts/anime.js');
} catch (err) {
    console.log(err);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting === 'UPDATE_ANIME_LIST') {
        
        // TODO -> GET FROM sendMessage
        const anime_id = '';
        const anime_status = '';
        const anime_progress = '';

        const status = await updateAnimeList(anime_id, anime_status, anime_progress);
        sendResponse(status);
    }
});