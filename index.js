import dotenv from 'dotenv/config'
import express from 'express';
import dbClient from './src/config/db.config.js';
import router from './src/routes/router.js';
import http from 'http';
import initializeSocket from './src/config/socket.config.js';
import { ZodError } from 'zod';

const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(router);

// dotenv.config();


await dbClient.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error executing query:', err);
    } else {
        console.log('Database time:', res.rows[0].now);
    }
});

const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS 
users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    name VARCHAR(50) NOT NULL, 
    phone_number VARCHAR(15) NOT NULL, 
    email VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)`

const createChatRoomTableQuery = `
CREATE TABLE IF NOT EXISTS 
chat_rooms(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_group BOOLEAN DEFAULT FALSE,
    
    group_name VARCHAR(20),
    group_description VARCHAR(100),
    group_avatar VARCHAR(100),
    created_by UUID,

    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (created_by) REFERENCES users(id)
)`;

const chatParticipantsTableQuery = `
CREATE TABLE IF NOT EXISTS
chat_participant(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES chat_rooms(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)`;

await dbClient.query(`
DO $$
BEGIN
    CREATE TYPE message_type AS ENUM (
        'text',
        'image',
        'video'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
`);

console.log("ENUM type 'message_type' verified/created successfully.")

const createMessageTableQuery = `
CREATE TABLE IF NOT EXISTS 
messages(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type message_type NOT NULL,
    content TEXT NOT NULL,
    chat_room_id UUID REFERENCES chat_rooms(id),
    sender_id UUID REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)`

await dbClient.query(createUserTableQuery, (err, res) => {
    if (err) {
        console.error('Error creating users table:', err);
    } else {
        console.log('Users table created or already exists');
    }
});

await dbClient.query(createChatRoomTableQuery, (err, res) => {
    if (err) {
        console.error('Error creating chat_rooms table:', err);
    } else {
        console.log('Chat rooms table created or already exists');
    }
});

await dbClient.query(createMessageTableQuery, (err, res) => {
    if (err) {
        console.error('Error creating messages table:', err);
    } else {
        console.log('Messages table created or already exists');
    }
});

await dbClient.query(chatParticipantsTableQuery, (err, res) => {
    if (err) {
        console.error('Error creating chat_participant table:', err);
    } else {
        console.log('chat_participant table created or already exists');
    }
});


initializeSocket(server);



server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use((err, req, res, next) => {
    console.error(`Error ======================> ${typeof err}`)

    if (err instanceof ZodError) {
        console.error(`Error of ZOD handler`)
    }


    res.status(err.status || 500).json({
        message: err.message,
        success: false
    })
})