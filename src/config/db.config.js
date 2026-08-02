import {Pool} from 'pg';

const pool = new Pool({connectionString: process.env.DATABASE_URL});

// const dbClient = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'my_database',
//     password: '1234',
//     port: 5432,
// });


// const sql = postgres('postgres://postgres:1234@localhost:5432/my_database', {
//     max: 10, // Set the maximum number of connections in the pool
//     debug: true, // Enable debug mode to log SQL queries
// })

pool.connect()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

export default pool;