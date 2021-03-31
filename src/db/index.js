const pool = require('./pool')

pool.on('error', (err, client) => {
    console.error(err)
})

let queue = []

/**
 * Queue data into the queue to update database
 * @params turnData - [black card (cid), played cards (cid | Array), winning card (cid)]
 */
function queueDB(turnData) {
    try {
        if (
            typeof turnData !== 'object' ||
            turnData.length !== 3 ||
            typeof turnData[1] !== 'object'
        ) {
            console.log(turnData)
            throw 'Invalid turn data. Object not queued for database update'
        }
        queue.push(turnData)
        // resolveQueue()
    } catch (ex) {
        console.error(ex)
    }
}

/**
 * Sends data from the queue to database
 */
async function resolveQueue() {
    try {
        const promises = queue.map((data) => {
            return writeToDB(data)
        })
        await Promise.all(promises)
        queue = []
    } catch (ex) {
        console.error(ex)
    }
}

async function writeToDB(turnData) {
    const client = await pool.connect()
    console.log('Client connected')
    try {
        await client.query('BEGIN')
        const data = {
            blackCard: turnData[0],
            playedCards: turnData[1],
            winningCard: turnData[2],
        }
        // console.log(data);
        data['playedCards'].map(async (card) => {
            const { queryText, param, winning } = buildQuery(
                card,
                data['winningCard']
            )
            const queryValues = [data['blackCard'], ...param, 1, winning]
            console.log(queryText, queryValues)
            await pool.query(queryText, queryValues)
        })
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        console.error(e)
    } finally {
        console.log('Releasing client')
        client.release()
    }
}

function buildQuery(card, winningCard) {
    let table_name = ''
    let columns = ''
    let values = ''
    let conflict = ''
    let param = []
    let winning = 1
    let winningCardModifier = ''
    if (typeof card === 'number') {
        table_name = 'play_one_card'
        columns = 'black_card, white_card, played, win'
        values = '$1, $2, $3, $4'
        conflict = 'black_card, white_card'
        param = [card]
        if (card !== winningCard) {
            winning = 0
        }
    } else if (typeof card === 'object' && card.length === 2) {
        table_name = 'play_two_card'
        columns = 'black_card, white_card1, white_card2, played, win'
        values = '$1, $2, $3, $4, $5'
        conflict = 'black_card, white_card1, white_card2'
        param = card
        if (!card.includes(winningCard)) {
            winning = 0
        }
    } else if (typeof card === 'object' && card.length === 3) {
        table_name = 'play_three_card'
        columns =
            'black_card, white_card1, white_card2, white_card3, played, win'
        values = '$1, $2, $3, $4, $5, $6'
        conflict = 'black_card,	white_card1, white_card2, white_card3'
        param = card
        if (!card.includes(winningCard)) {
            winning = 0
        }
    } else {
        throw 'Invalid query data'
    }

    if (winning === 1) {
        winningCardModifier = `, win = ${table_name}.win + 1`
    }

    return {
        queryText: `INSERT INTO ${table_name}(${columns}) VALUES (${values}) ON CONFLICT(${conflict}) DO UPDATE SET played = ${table_name}.played + 1${winningCardModifier}`,
        param: param,
        winning: winning,
    }
}

module.exports = { queueDB: queueDB, resolveQueue: resolveQueue }
