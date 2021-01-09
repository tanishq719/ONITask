const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password: "tanishq719",
    host: "localhost",
    port: 5432,
    database: "myfeedapp"
});

module.exports = pool