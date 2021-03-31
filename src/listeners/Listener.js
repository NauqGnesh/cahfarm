const axios = require('axios')
const Moniker = require('moniker')
const setCookie = require('set-cookie-parser')

/**
 * Constructor
 */
function Listener(url) {
    // game server urls
    // https://pyx-1.pretendyoure.xyz/zy
    // or
    // https://pyx-2.pretendyoure.xyz/zy
    // or
    // https://xyzzy.clrtd.com/zy
    this.url = url
    this.JSESSIONID = null
    this.alive = false
}

/**
 * Generates random name in lowercase "adjective_noun"
 * eg: thundering_herd
 */
const nameGenerator = Moniker.generator([Moniker.adjective, Moniker.noun], {
    maxSize: 30,
    encoding: 'utf-8',
    glue: '_',
})

/**
 * GET a JSESSIONID cookie for the target site
 * @param {string} url - Target site
 * @return {string} JSESSIONID
 */
Listener.prototype.createSessionID = async function (url) {
    const response = await axios.get(`${url}/game.jsp`)
    const cookies = setCookie(response.headers['set-cookie'], { map: true })
    // console.log('Cookies:', cookies)
    return cookies.JSESSIONID.value
}

/**
 * Creates a player on the target site
 * @param {string} sessionId - JSESSIONID (any unbounded session cookie)
 * @param {string} url - Target site
 * @return {object} reponse from POST request
 */
Listener.prototype.createListener = async function (sessionId, url) {
    const name = nameGenerator.choose()
    console.log('Listener name:', name)
    const data = `o=r&n=${name}&s=1`
    const config = {
        method: 'post',
        url: `${url}/AjaxServlet`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Cookie: `JSESSIONID=${sessionId}`,
        },
        data,
    }

    const response = await axios(config)
    this.alive = true
    return response.data
}

/**
 * Get all the all the games in the lobby
 * @param {string} sessionId - JSESSIONID (session cookie bounded to instance)
 * @param {string} url - Target site
 * @return {object} game list
 */
Listener.prototype.getGameList = async function (sessionId, url) {
    const data = 'o=ggl&s=2'
    const config = {
        method: 'post',
        url: `${url}/AjaxServlet`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Cookie: `JSESSIONID=${sessionId}`,
        },
        data,
    }

    console.log('Getting game list...')
    const response = await axios(config)
    return response.data
}

/**
 * Join game with corresponding game id
 * @param {string} sessionId - JSESSIONID (session cookie bounded to instance)
 * @parm {number} gid
 * @param {string} url - Target site
 * @return {object} game list
 */
Listener.prototype.joinGame = async function (sessionId, gid, url) {
    const data = `o=vg&gid=${gid}&s=3`

    const config = {
        method: 'post',
        url: `${url}/AjaxServlet`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Cookie: `JSESSIONID=${sessionId}`,
        },
        data,
    }

    const response = axios(config)
    return response.data
}

/**
 * Get game info
 * @param {string} sessionId - JSESSIONID (session cookie bounded to instance)
 * @parm {number} gid
 * @param {string} url - Target site
 * @return {object}
 */
Listener.prototype.getGameInfo = async function (sessionId, gid, url) {
    const data = `o=ggi&gid=${gid}&s=4`

    const config = {
        method: 'post',
        url: `${url}/AjaxServlet`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Cookie: `JSESSIONID=${sessionId}`,
        },
        data,
    }

    const response = await axios(config)
    return response.data
}

/**
 * Logs the instance out from target site
 * @param {string} sessionId - JSESSIONID (session cookie bounded to instance)
 * @param {string} url - Target site
 * @return {object}
 */
Listener.prototype.logOut = async function (sessionId, url) {
    const data = 'o=lo&s=5'

    const config = {
        method: 'post',
        url: `${url}/AjaxServlet`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Cookie: `JSESSIONID=${sessionId}`,
        },
        data: data,
    }

    const response = await axios(config)
    return response.data
}

/**
 * LongPoll request to get live gamplay data
 * @param {string} sessionId - JSESSIONID (session cookie bounded to instance)
 * @param {string} url - Target site
 * @return {object}
 */
Listener.prototype.longPoll = async function (sessionId, url) {
    const config = {
        method: 'post',
        url: `${url}/LongPollServlet`,
        headers: {
            Cookie: `JSESSIONID=${sessionId}`,
        },
    }

    const response = await axios(config)
    return response.data
}

/**
 * Log out and terminate all running processes
 */
Listener.prototype.terminate = function () {
    console.log('Listener logging out')
    this.logOut(this.JSESSIONID, this.url)
    this.alive = false
}

module.exports = Listener
