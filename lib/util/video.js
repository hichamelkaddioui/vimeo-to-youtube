const fs = require('fs-extra')

module.exports.getBestDownloadOption = video => video
  .download
  .sort((downloadA, downloadB) => downloadA.size - downloadB.size)
  .pop()

module.exports.getYoutubeInsertOptions = video => (
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
