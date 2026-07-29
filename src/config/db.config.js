import {Client} from 'pg';

const dbClient = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'my_database',
    password: '1234',
    port: 5432,
});


// const sql = postgres('postgres://postgres:1234@localhost:5432/my_database', {
//     max: 10, // Set the maximum number of connections in the pool
//     debug: true, // Enable debug mode to log SQL queries
// })

dbClient.connect()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

export default dbClient;