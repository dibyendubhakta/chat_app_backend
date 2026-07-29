import dbClient from "../config/db.config.js";

// create chat room 
const createChatRoom = async (req, res) => {
    try {
        const { sender_id, receiver_phone } = req.body;
        // get receiver id
        const receiverQuery = `SELECT id FROM users WHERE phone_number = $1 LIMIT 1`

        const queryResult = await dbClient.query(receiverQuery, [receiver_phone]);

        // IF receiver not found
        if (queryResult.rows.length === 0) {
            return res.status(404).json({ message: 'receiver not found' });
        }

        const receiver_id = queryResult.rows[0].id;

        // Create chat room row
        const chatRoomCreateQuery = `INSERT INTO chat_rooms
            (sender_id, receiver_id) 
            VALUES($1, $2)`;

        const result = await dbClient.query(chatRoomCreateQuery, [sender_id, receiver_id]);

        console.log(`result >> ${result}`);
        

        res.status(200).json({ message: 'Chat room created' });

    } catch (error) {
        console.error('Error creating chat room:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Add user to the chat list
const addToChatList = async (req, res) => {
    
}

export { createChatRoom };