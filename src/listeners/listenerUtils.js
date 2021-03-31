const axios = require('axios')
const Moniker = require('moniker')
const setCookie = require('set-cookie-parser')

const nameGenerator = Moniker.generator([Moniker.adjective, Moniker.noun], {
    maxSize: 30,
    encoding: 'utf-8',
    glue: '_',
})

async function createSessionID(url) {
    const response = await axios.get(`${url}/game.jsp`)
    const cookies = setCookie(response.headers['set-cookie'], { map: true })
    // console.log('Cookies:', cookies)
    return cookies.JSESSIONID.value
}

async function createListener(sessionId, url) {
    const name = nameGenerator.choose()
    console.log('Spectator name:', name)
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
    return response.data
}

async function getGameList(sessionId, url) {
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

async function joinGame(sessionId, gid, url) {
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

async function getGameInfo(sessionId, gid, url) {
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

async function longPollGameplayData(sessionId, url) {
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

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function loopLongPoll(sessionId, url) {
    const gameplayData = await longPollGameplayData(sessionId, url)
    console.log('LongPollLoop:', gameplayData)
    loopLongPoll(sessionId, url)
}

module.exports = {
    createSessionID,
    createListener,
    getGameList,
    joinGame,
    getGameInfo,
    longPollGameplayData,
    loopLongPoll,
}
