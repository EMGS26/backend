const DataBase = require("../Database");

const db = new DataBase()
db.connect("192.168.0.130", "kine", "kine", "kine")

module.exports = db