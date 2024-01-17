const db = require("../db/connection")
const {readFile} = require("fs/promises")


exports.fetchAllEndpoints = ()=>{
    return readFile(`${__dirname}/../endpoints.json`, "utf8")
    .then (data => {
        return JSON.parse(data)
    })
}