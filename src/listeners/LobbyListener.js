const Listener = require('./Listener')
const { createGameListener } = require('./GameListener')

/*
 * Constructor
 */
function LobbyListener(url) {
    Listener.call(this, url)
    this.availableRooms = []
    this.gameListeners = {}
}

LobbyListener.prototype = Object.create(Listener.prototype)
LobbyListener.prototype.constructor = Listener

/**
 * Filter for rooms that aren't password-protected, have ongoing game
 * and has not reached the spectator limit
 */
function filterRoom(gameList) {
    return gameList['gl']
        .filter(
            (room) =>
                room['hp'] === false &&
                room['S'] !== 'l' &&
                room['go']['vL'] - room['V'].length > 1
        )
        .map((room) => room['gid'])
}

/**
 * Create a new player on target site
 * and scan for available rooms
 */
LobbyListener.prototype.listen = async function () {
    try {
        this.JSESSIONID = await this.createSessionID(this.url)
        const listenerInfo = await this.createListener(
            this.JSESSIONID,
            this.url
        )
        console.log('LobbyListener created: ', { ...this, ...listenerInfo })
    } catch (ex) {
        console.log(ex)
    }
}

/**
 * The site will kick us out if idle for too long
 */
LobbyListener.prototype.keepConnectionAlive = function () {
    const thirtySeconds = 30 * 1000
    return setInterval(() => {
        if (this.alive) {
            this.longPoll(this.JSESSIONID, this.url)
        }
    }, thirtySeconds)
}

/**
 * Scans for rooms that aren't password-protected, have ongoing game
 * and has not reached the spectator limit
 */
LobbyListener.prototype.scanAvailableRooms = async function () {
    try {
        console.log('Sanning for available rooms')
        const gameList = await this.getGameList(this.JSESSIONID, this.url)
        // console.log(gameList)
        const filteredGameIds = filterRoom(gameList)
        console.log('Available rooms:', filteredGameIds)
        this.availableRooms = filteredGameIds
    } catch (error) {
        console.error(error)
    }
}

/**
 * Check if gameListener is still alive or if game has ended
 */
LobbyListener.prototype.checkGameListeners = function () {
    console.log('Checking game listeners')
    for (const gid in this.gameListeners) {
        if (!this.gameListeners[gid].alive) {
            console.log('Removing game listener in room', gid)
            delete this.gameListeners[gid]
        } else if (!this.availableRooms.includes(parseInt(gid))) {
            console.log('Game no longer active in', gid)
            this.gameListeners[gid].terminate()
            console.log('Removing game listener in room', gid)
            delete this.gameListeners[gid]
        }
    }
}

/**
 * Create a gameListener for each open room
 */
LobbyListener.prototype.dispatchGameListeners = async function () {
    console.log('Dispatching game listeners... ')
    let i = 0
    for (const gid of this.availableRooms) {
        if (!Object.prototype.hasOwnProperty.call(this.gameListeners, gid)) {
            console.log('Dipatched game listener to room')
            const gameListener = await createGameListener(this.url, gid)
            this.gameListeners[gid] = gameListener
            i++
        }
    }
    console.log(`Dispatched ${i} game listeners`)
    console.log(this.gameListeners)
}

/**
 * Terminates all gameListners and then itself
 */
LobbyListener.prototype.terminateAll = function () {
    console.log('Terminating all listeners')
    for (const gid in this.gameListeners) {
        this.gameListeners[gid].terminate()
    }
    this.terminate()
}

/**
 * Factory method
 */
const createLobbyListener = async (url) => {
    console.log('Creating lobby listener')
    const lobbyListener = new LobbyListener(url)
    await lobbyListener.listen()
    return lobbyListener
}

module.exports = {
    createLobbyListener: createLobbyListener,
}
