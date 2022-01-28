const fs = require('fs');
const path = require('path');
class Database {
    #db = {}
    constructor(object) {
        this.#db = object
    }
    read(key) {
        if (!this.#db[key]) return false
        return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../', this.#db[key]), 'utf8'))
    }
    write(key, ...params) {
        if (!this.#db[key]) return false
        let chunk = this.read(key)
        chunk.push(...params)
        return fs.writeFileSync(path.resolve(__dirname, '../', this.#db[key]), JSON.stringify(chunk, null, 4))
    }
}
module.exports = Database