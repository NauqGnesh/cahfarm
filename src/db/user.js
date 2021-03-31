const pool = require('./pool')
const bcrypt = require('bcrypt')

const checkPassword = async function (password, passwordHash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHash, (err, same) => {
            if (err) {
                return reject(err)
            }
            resolve(same)
        })
    })
}

const createUserTable = async () => {
    const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
  (id SERIAL PRIMARY KEY, 
  email VARCHAR(100) UNIQUE NOT NULL, 
  password VARCHAR(100) NOT NULL
  )`

    try {
        const res = await pool.query(userCreateQuery)
        console.log(res)
    } catch (ex) {
        console.error(ex)
    } finally {
        pool.end()
    }
}

const queryUserByEmail = async (email) => {
    const queryText = 'SELECT * FROM users WHERE email=$1'
    const { rows } = await pool.query(queryText, [email])
    return rows[0]
}

const queryUserById = async (id) => {
    const queryText = 'SELECT * FROM users WHERE id=$1'
    const { rows } = await pool.query(queryText, [id])
    return rows[0]
}

module.exports = {
    createUserTable,
    checkPassword,
    queryUserByEmail,
    queryUserById,
}
