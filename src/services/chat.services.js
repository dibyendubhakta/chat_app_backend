import dbClient from "../config/db.config.js";

const addUserToChatRoom = async (isGroup, groupName, groupDescription, groupAvatar, createdBy) => {
    if (isGroup) {
        const addUserToChatRoomQuery = `INSERT INTO chat_rooms
    (is_group, group_name, group_description, group_avatar, created_by) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        return await dbClient.query(addUserToChatRoomQuery, [isGroup, groupName, groupDescription, groupAvatar, createdBy]);
    } else {
        const addUserToChatRoomQuery = `INSERT INTO chat_rooms
    (is_group) 
    VALUES ($1) RETURNING *`;
        return await dbClient.query(addUserToChatRoomQuery, [isGroup]);
    }
}

const addUserToChatParticipant = async (chatId, userId) => {
    const dbQuery = `INSERT INTO chat_participant (chat_id, user_id) VALUES ($1, $2)`;
    return dbClient.query(dbQuery, [chatId, userId]);
}

const getAllUsersFromChatRoom = async (roomId) => {
    const dbQuery = `SELECT * FROM chat_participant WHERE chat_id = $1`;
    return dbClient.query(dbQuery, [roomId]);
}

const insertNewMessage = async (type, msg, room_id, sender_id) => {
    const messageStoreQuery = `INSERT INTO 
            messages(type, content, chat_room_id, sender_id) 
            VALUES($1, $2, $3, $4)`;

    return await dbClient.query(messageStoreQuery, [type, msg, room_id, sender_id]);
}

export { addUserToChatRoom, addUserToChatParticipant, getAllUsersFromChatRoom, insertNewMessage };