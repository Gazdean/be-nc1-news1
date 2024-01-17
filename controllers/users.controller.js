const{fetchAllUsers} = require("../models/users.model.js")

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers().then(users=>{
        res.status(200).send({users})
    }).catch(next)
}
