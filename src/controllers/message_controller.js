import dbClient from "../config/db.config.js";

// create chat room 
const sendMessage = async (req, res) => {
    try {
        const { sender_id, chat_room_id, type, content } = req.body;

        const types = ['text', 'image', 'video'];

        // validate type
        if (!types.includes(type)) {
            return res.status(404).json({ message: `Type not includes ${types}` });
        }

        // Use socket to notify others
        


        // Create chat room row
        const messageStoreQuery = `INSERT INTO 
            messages(type, content, chat_room_id, sender_id) 
            VALUES($1, $2, $3, $4)`;

        const result = await dbClient.query(messageStoreQuery, [type, content, chat_room_id, sender_id]);

        console.log(`result >> ${result.rows}`);


        res.status(200).json({ message: 'Message send' });

    } catch (error) {
        console.error('Error creating chat room:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { sendMessage };