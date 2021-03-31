const { createLobbyListener } = require('../listeners/LobbyListener')
const { resolveQueue } = require('../db/index')

let listener
let connectionaInterval
let gameListenerInterval
const start = async (req, res) => {
    const url = 'https://pyx-1.pretendyoure.xyz/zy'
    // const url = 'https://pyx-2.pretendyoure.xyz/zy';
    // const url = 'https://xyzzy.clrtd.com/zy' // This site uses different card index

    // create a listener on the lobby
    res.send(`Listening to ${url}`)
    listener = await createLobbyListener(url)
    await listener.scanAvailableRooms()
    // listener gets available room
    await listener.dispatchGameListeners()
    // longPoll server to keep connection alive
    connectionaInterval = listener.keepConnectionAlive()

    const fiveMinutes = 5 * 60 * 1000
    gameListenerInterval = setInterval(async () => {
        // garbage collect inactive game listeners
        try {
            listener.checkGameListeners()
            // scan for new games
            const p1 = listener.scanAvailableRooms()
            // push data to database
            const p2 = resolveQueue()
            await Promise.all([p1, p2])
            // send game listener to new rooms (none if no new rooms)
            listener.dispatchGameListeners()
        } catch (ex) {
            console.error(ex)
        }
    }, fiveMinutes)

    res.send(`Listening to ${url}`)
}

const stop = async (req, res) => {
    try {
        listener.terminateAll()
        clearInterval(connectionaInterval)
        clearInterval(gameListenerInterval)
        res.send('All processes terminated')
    } catch (ex) {
        console.log(ex)
        res.send('No ongoing processes')
    }
}

module.exports = { start, stop }
