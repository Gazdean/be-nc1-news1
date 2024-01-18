const db = require("./db/connection.js")

exports.rowValueValidation = (value, column, table) =>{
    return db.query(`
        SELECT * FROM ${table} WHERE ${column} = $1;
    `, [ value]
    ).then(({rows})=>{
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: `${column} does not exist`})
        } 
    })
}
