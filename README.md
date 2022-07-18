# Anitrex
Anime tracking extension for Chrome/Edge that uses AniList API.
> [Installation guide](#installation)
>

![](https://github.com/uiriansan/Anitrex/blob/master/pres.gif)

## Installation
1. Clone this repo;
2. Open Chrome/Edge and navigate to ```Extensions```;
3. Enable ```Developer mode```;
4. Click ```Load unpacked``` and open the folder that contains ```manifest.json``` file;
5. Proceed to [Setup](#setup)

## Setup
1. Go to [AniList API Clients](https://anilist.co/settings/developer), create a new client and copy your ID;
2. Rename ```/src/scripts/anilist_clientid copy.js``` to ```/src/scripts/anilist_clientid.js```;
3. Open ```anilist_clientid.js``` and replace "YOUR_ANILIST_CLIENT_ID" by your ID;
4. Right click extension icon and select ```Extension options```;
5. Click ```Get token```, copy the text and paste into ```AniList token``` field;
6. Click ```Set token```. You should see your avatar and username refreshing the page;


---
> Icon: [Bai Qu: Hundreds of Melodies on Steam](https://steamcommunity.com/market/search?appid=753&category_753_Game%5B%5D=tag_app_516600&q=emoticons)