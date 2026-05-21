const DataBase = require("../Database");

const db = new DataBase()
db.connect("172.22.1.112", "kine", "kine", "kine")

module.exports = db