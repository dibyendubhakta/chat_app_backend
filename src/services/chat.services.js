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

const getChatUserList = async (userId) => {
    const getAllUsersQuery = `SELECT
    cr.id AS chat_room_id,
    u.id,
    u.name,
    u.phone_number,
    u.email
FROM chat_rooms cr
JOIN chat_participant cp1
    ON cp1.chat_id = cr.id
JOIN chat_participant cp2
    ON cp2.chat_id = cr.id
    AND cp2.user_id <> cp1.user_id
JOIN users u
    ON u.id = cp2.user_id
WHERE cp1.user_id = $1
    AND cr.is_group = FALSE
    AND cr.is_deleted = FALSE
    AND u.is_deleted = FALSE;`;
    return await dbClient.query(getAllUsersQuery, [userId]);
}

const getAllPreviousChat = async (chat_room_id) => {
    const query = `SELECT * FROM messages WHERE chat_room_id = $1`;
    return await dbClient.query(query, [chat_room_id]);
}

export { addUserToChatRoom, addUserToChatParticipant, getAllUsersFromChatRoom, insertNewMessage, getChatUserList, getAllPreviousChat };