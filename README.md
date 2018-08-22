[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Vimeo to YouTube

> A Node.js app to easily transfer your videos from Vimeo to YouTube

## Requirements

- Node.js `>= 9`
- [Vimeo API keys](https://developer.vimeo.com/api/start): you must first create an application and create an access token
- [YouTube API keys](https://developers.google.com/youtube/v3/getting-started): follow the steps of [the section "Step 1: Turn on the YouTube Data API"](https://developers.google.com/youtube/v3/quickstart/nodejs#step_1_turn_on_the_api_name) and download your API keys
- A good Internet connection

## Quick start

Clone this repo:
```console
git clone https://github.com/hichamelkaddioui/vimeo-to-youtube
```
Install dependencies:
```console
npm install
```

Create a `.env` file based on `.env.dist`, fill it with your API keys and run
```console
npm start
```

## Environment variables

Key | Type | Description | Default
--|--|--|--
`VIMEO_CLIENT_ID` | `String` | The Client ID of your Vimeo application |
`VIMEO_CLIENT_SECRET` | `String` | The Client Secret of your Vimeo application |
`VIMEO_ACCESS_TOKEN` | `String` | A generated Access Token |
`VIMEO_VIDEOS_PER_PAGE` | `Number` | The number of videos to fetch per request. [More info here](https://developer.vimeo.com/api/common-formats#pagination) | `100`
`VIMEO_VIDEOS_FIELDS` | `String` | The fields of the video object to filter from the Vimeo API. [More info here](https://developer.vimeo.com/api/common-formats#json-filter) | `'resource_key,name,description,tags,files,download,privacy,categories'`
`YOUTUBE_CLIENT_ID` | `String` | The Client ID of your YouTube application |
`YOUTUBE_PROJECT_ID` | `String` | The Project ID of your YouTube application |
`YOUTUBE_AUTH_URI` | `String` | OAuth2 auth URI | `'https://accounts.google.com/o/oauth2/auth'`
`YOUTUBE_TOKEN_URI` | `String` | OAuth2 token URI | `'https://www.googleapis.com/oauth2/v3/token'`
`YOUTUBE_AUTH_PROVIDER_X509_CERT_URL` | `String` | OAuth2 certs URL | `'https://www.googleapis.com/oauth2/v1/certs'`
`YOUTUBE_CLIENT_SECRET` | `String` | The Client Secret of your YouTube application |
`YOUTUBE_REDIRECT_URIS` | `String` | OAuth2 redirect URIs | `'urn:ietf:wg:oauth:2.0:oob,http://localhost'`
`YOUTUBE_TOKEN_PATH` | `String` | The path of the file in which to store the access token | `'youtube-oauth2-credentials.json'` in the user's app config folder, retrieved with [platform-folders](https://www.npmjs.com/package/platform-folders) 
`DB_FILENAME` | `String` | The path of the local database file | `'db/videos.db'`
`DOWNLOAD_DEST` | `String` | The path of the folder into which store the downloaded videos | The user's app data folder, retrieved with [platform-folders](https://www.npmjs.com/package/platform-folders) 
`DOWNLOAD_PARALLEL_VIDEOS` | `Number` | The number of videos to download in parallel | `3`
`WORKER_PARALLEL_UPLOADS` | `Number` | The number of parallel uploads to launch | `3`