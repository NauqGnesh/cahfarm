const Listener = require('./Listener')
const { queueDB } = require('../db/index')

/**
 * Constructor
 */
function GameListener(url, gid) {
    Listener.call(this, url)
    this.gid = gid
    this.turnData = [] // [black card (cid), played cards (cid | Array), winning card (cid)]
}

GameListener.prototype = Object.create(Listener.prototype)
GameListener.prototype.constructor = Listener

/**
 * Creates a player on target site and joins a game room
 * and listens to gameplay data
 */
GameListener.prototype.listen = async function () {
    try {
        this.JSESSIONID = await this.createSessionID(this.url)
        const listenerInfo = await this.createListener(
            this.JSESSIONID,
            this.url
        )
        console.log('GameListener created: ', { ...this, ...listenerInfo })
        await this.joinGame(this.JSESSIONID, this.gid, this.url)
        console.log('GameListener joined room', this.gid)
        this.loopLongPoll(this.JSESSIONID, this.url)
    } catch (ex) {
        console.log(ex)
    }
}

/**
 * An infinite loop to listen gameplay data
 * stops when game stops or an error
 */
GameListener.prototype.loopLongPoll = async function (sessionId, url) {
    try {
        while (this.alive) {
            const gameplayData = await this.longPoll(sessionId, url)
            const jsonData = gameplayData[0]
            if (
                jsonData != undefined &&
                (Object.prototype.hasOwnProperty.call(jsonData, 'bc') ||
                    Object.prototype.hasOwnProperty.call(jsonData, 'wc') ||
                    Object.prototype.hasOwnProperty.call(jsonData, 'WC'))
            ) {
                // console.log('LongPollLoop:', jsonData)
                this.storeTurnData(jsonData)
            }
        }
    } catch (error) {
        console.log(error)
        await this.terminate()
    }
}

/**
 * Stores turn data and checks if it's in the proper format
 */
GameListener.prototype.storeTurnData = function (data) {
    try {
        const stage = this.turnData.length
        console.log(`game ${this.gid}: stage ${stage}`)
        switch (stage) {
        case 0:
            this.resolveStage0(data)
            break
        case 1:
            this.resolveStage1(data)
            break
        case 2:
            this.resolveStage2(data)
            break
        }
    } catch (ex) {
        console.error(ex)
    }
}

const storeTurnDataHelper = (prop, callback) => {
    return function (data) {
        // console.log(data)
        if (Object.prototype.hasOwnProperty.call(data, prop)) {
            const bindedCallback = callback.bind(this)
            bindedCallback(data, prop)
        } else {
            console.log(`Malformed sequence: ${this.turnData} Dropping data`)
            this.turnData = []
        }
    }
}

GameListener.prototype.resolveStage0 = storeTurnDataHelper(
    'bc',
    function (data, prop) {
        this.turnData.push(data[prop]['cid'])
        console.log('Black card:', this.turnData[0])
    }
)

GameListener.prototype.resolveStage1 = storeTurnDataHelper(
    'wc',
    function (data, prop) {
        this.turnData.push(parsePlayedCards(data[prop]))
        console.log('Played card:', this.turnData[1])
    }
)

GameListener.prototype.resolveStage2 = storeTurnDataHelper(
    'WC',
    function (data, prop) {
        this.turnData.push(data[prop])
        console.log('Winning card:', this.turnData[2])
        queueDB(this.turnData)
        this.turnData = []
    }
)

/**
 * parse the list of played cards in stage 1 form storeTurnData
 * @return number | Array - List of card ids
 */
function parsePlayedCards(playedCards) {
    return playedCards.map((i) => {
        if (i.length === 1) {
            return i[0]['cid']
        } else if (i.length === 2) {
            return i.map((i) => {
                return i['cid']
            })
        }
    })
}

/*
 * Factory method
 */
const createGameListener = async (url, gid) => {
    console.log('Creating game listener for room', gid)
    const gameListener = new GameListener(url, gid)
    gameListener.listen()
    return gameListener
}

module.exports = {
    createGameListener: createGameListener,
}
