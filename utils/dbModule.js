const dotenv = require('dotenv');
const { Pool } = require("pg");

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '.env.dev' }); // .env.dev in top-level directory "app"
}

const devConfig = {
    hostname: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}

// Connecting to PROD DB on Dev Environment; for DB testing
const stageConfig = {
    host: process.env.INSTANCE_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};

// const pool = new Pool(process.env.NODE_ENV === "production" ? prodConfig : devConfig);
const pool = new Pool(process.env.NODE_ENV === "production" ? {} : devConfig);

// DEBUG database connection
// pool.on('error', (e) => {
//     console.log('Postgres  Pool error')
//     console.log(e, e.stack, e.message);
// });


// pool.on('connect', (res) => {
//     console.log('Connected to database');
//     if (process.env.NODE_ENV === "production") {
//         console.log(prodConfig);
//     } else console.log(devConfig);
// })

module.exports = {
    performQuery: (text) => {
        return pool.query(text);
    }
}