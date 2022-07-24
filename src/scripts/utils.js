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

// DICE COEFFICIENT

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

// LEVENSHTEIN DISTANCE

function levenshteinDistance(str1, str2) {
    const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i += 1) {
            track[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j += 1) {
            track[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1, // deletion
                    track[j - 1][i] + 1, // insertion
                    track[j - 1][i - 1] + indicator, // substitution
                );
            }
        }
    return track[str2.length][str1.length];
}

// function addAnimeToRecent(anime, new_progress) {
//     let recent_list = localStorage.getItem('anitrex-recent-list');

//     if (!recent_list) {
//         localStorage.setItem('anitrex-recent-list', JSON.stringify([]));
//     }
//     recent_list = JSON.parse(recent_list);
    
//     const anime_in_recent_list = recent_list.findIndex(x => x.media.id == anime.media.id);
//     if (anime_in_recent_list === 0) {
//         if (new_progress && !isNaN(new_progress)) {
//             recent_list[0].progress = new_progress;
//             localStorage.setItem('anitrex-recent-list', JSON.stringify(recent_list));        
//         }
//         return;
//     }

//     if (anime_in_recent_list !== -1) {
//         recent_list.splice(anime_in_recent_list, 1);
//     } else {
//         recent_list.splice(4, 1);
//     }

//     recent_list.unshift(anime);

//     localStorage.setItem('anitrex-recent-list', JSON.stringify(recent_list));
// }