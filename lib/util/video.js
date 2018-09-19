const sortBySize = videos => videos.filter(video => video.download.length).sort((videoA, videoB) => getBestDownloadOption(videoA).size - getBestDownloadOption(videoB).size)

const getBestDownloadOption = video => {
  if (!video || !video.download) return { size: 0 }

  const sortedDownload = video.download.sort((downloadA, downloadB) => downloadA.size - downloadB.size)

  return sortedDownload[sortedDownload.length - 1]
}

const getYoutubeInsertOptions = ({ video, body }) => (
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
      body: body
    }
  }
)

module.exports = { sortBySize, getBestDownloadOption, getYoutubeInsertOptions }
