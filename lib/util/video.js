const fs = require('fs-extra')

const sortBySize = videos => videos.sort((videoA, videosB) => getBestDownloadOption(videoA).size - getBestDownloadOption(videosB).size)

const getBestDownloadOption = video => {
  if (video.download.length) {
    return video
      .download
      .sort((downloadA, downloadB) => downloadA.size - downloadB.size)
      .pop()
  }

  return {
    size: 0
  }
}

const getYoutubeInsertOptions = video => (
  {
    part: 'id,snippet,status',
    notifySubscribers: false,
    requestBody: {
      snippet: {
        title: video.name,
        description: video.description,
        tags: video.tags.map(tag => tag.tag)
      },
      status: {
        privacyStatus: 'private'
      }
    },
    media: {
      body: fs.createReadStream(video.path)
    }
  }
)

module.exports = { sortBySize, getBestDownloadOption, getYoutubeInsertOptions }
