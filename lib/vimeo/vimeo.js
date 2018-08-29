const Vimeo = require('vimeo').Vimeo
const spinner = (require('ora'))()
const Promise = require('bluebird')

Promise.promisifyAll(Vimeo.prototype)

const { vimeoConfig } = require('../../config')
const perPage = vimeoConfig.perPage
const fields = vimeoConfig.fields
const client = new Vimeo(vimeoConfig.clientId, vimeoConfig.clientSecret, vimeoConfig.accessToken)

let videosFetched

/**
 * @private
 * @async
 * @param {Number} perPage - The number of videos to fetch per request
 * @return {Promise.<Number>} The last page of videos given the `vimeoConfig.perPage` setting
 */
const findLastPage = perPage => client.requestAsync(`/me/videos?per_page=${perPage}&fields=paging`)
  .then(response => parseInt(/.*&page=(\d+)/.exec(response.paging.last)[1]))

/**
 * @private
 * @async
 * @param {String} page
 * @return {Promise.<Object[]>} An array of videos fetched from a given page
 */
const fetch = page => client.requestAsync(page)
  .then(response => response.data)
  .then(videos => {
    videosFetched += videos.length
    spinner.text = `Fetched ${videosFetched} videos`

    return videos
  })

/**
 * @async
 * @return {Promise.<Object[]>} An array of all the videos fetched from the Vimeo account
 */
const fetchAll = ({ perPage, fields }) => () => findLastPage(perPage)
  .then(lastPage => {
    spinner.text = 'Fetching the list of all videos from Vimeo'
    spinner.start()

    videosFetched = 0
    const pages = []

    for (var i = 1; i <= lastPage; i++) {
      pages.push(fetch(`/me/videos?per_page=${perPage}&fields=${fields}&page=${i}`))
    }

    return Promise.all(pages)
  })
  .then(datas => {
    spinner.succeed(`Boom! Fetched ${videosFetched} videos in ${datas.length} requests.`)

    return [].concat(...datas)
  })

module.exports.fetchAll = fetchAll({ perPage, fields })
