const Vimeo = require('vimeo').Vimeo
const spinner = (require('ora'))()
const Promise = require('bluebird')

Promise.promisifyAll(Vimeo.prototype)

const { vimeoConfig } = require('../config')
const perPage = vimeoConfig.perPage
const fields = vimeoConfig.fields
const client = new Vimeo(vimeoConfig.clientId, vimeoConfig.clientSecret, vimeoConfig.accessToken)

let videosFetched = 0

/**
 * @private
 * @async
 * @param {String} path
 * @return {Promise.<Object[]>} An array of videos fetched from the `path`
 */
const fetchVideos = path => client.requestAsync(path)
  .then(response => response.data)
  .then(videos => {
    videosFetched += videos.length
    spinner.text = `Fetched ${videosFetched} videos`

    return videos
  })

/**
 * @private
 * @async
 * @param {Number} perPage - The number of videos to fetch per request
 * @return {Promise.<Number>} The last page of videos given the `vimeoConfig.perPage` setting
 */
const findLastPage = perPage => client.requestAsync(`/me/videos?per_page=${perPage}&fields=paging`)
  .then(response => parseInt(/.*&page=(\d+)/.exec(response.paging.last)[1]))

/**
 * @public
 * @async
 * @return {Promise.<Object[]>} An array of all the videos fetched from the Vimeo account
 */
const fetchAllVideos = ({ perPage, fields }) => () => findLastPage(perPage)
  .then(lastPage => {
    spinner.text = 'Fetching the list of all videos from Vimeo'
    spinner.start()

    const pagesOfVideos = []

    for (var i = 1; i <= lastPage; i++) {
      pagesOfVideos.push(fetchVideos(`/me/videos?per_page=${perPage}&fields=${fields}&page=${i}`))
    }

    return Promise.all(pagesOfVideos)
  })
  .then(pagesOfVideos => {
    spinner.succeed(`Boom! Fetched ${videosFetched} videos in ${pagesOfVideos.length} requests.`)

    return [].concat(...pagesOfVideos)
  })

module.exports.fetchAllVideos = fetchAllVideos({ perPage, fields })
