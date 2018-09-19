[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Vimeo to YouTube

> A Node.js CLI to easily transfer your videos from Vimeo to YouTube

Download all your videos from Vimeo with the push of a button, and upload them to YouTube with all their metadata.

![cli-demo](https://raw.githubusercontent.com/hichamelkaddioui/vimeo-to-youtube/master/assets/demo.gif)

## Features

- Highly customizable
- Download and upload videos in parallel 
- Keep metadata
- :star: **New:** transfer directly without any disk write

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

You can set these variables either by editing the `.env` file or by setting them before running the CLI. E.g.:
```console
LOGGER_LEVEL=debug npm start
```

Data folder (`$DATA_FOLDER`) and config folder (`$CONFIG_FOLDER`) are resolved with [platform-folders](https://www.npmjs.com/package/platform-folders).

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
`YOUTUBE_TOKEN_PATH` | `String` | The path of the file in which to store the access token | `'$CONFIG_FOLDER/vimeo-to-youtube/youtube-oauth2-credentials.json'`
`DB_FILENAME` | `String` | The path of the local database file | `'$DATA_FOLDER/vimeo-to-youtube/db/videos.db'`
`DOWNLOAD_DEST` | `String` | The path of the folder into which store the downloaded video files | `'$DATA_FOLDER/vimeo-to-youtube/files'`
`DOWNLOAD_PARALLEL_VIDEOS` | `Number` | The number of videos to download in parallel | `3`
`UPLOAD_PARALLEL_VIDEOS` | `Number` | The number of videos to upload in parallel | `3`
`LOGGER_LEVEL` | `String` | The level of log to display | `'info'`