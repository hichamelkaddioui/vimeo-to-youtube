[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Vimeo to YouTube

> A Node.js app to easily transfer your videos from Vimeo to YouTube

## Requirements

- Node.js `>= 9`
- [Vimeo API keys](https://developer.vimeo.com/api/start): you must first create an application and create an access token
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
