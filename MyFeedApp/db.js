const Pool = require("pg").Pool
const password = require("./password")

const pool = new Pool({
    user: "postgres",
    password: password,
    host: "localhost",
    port: 5432,
    database: "myfeedapp"
});

module.exports = pool