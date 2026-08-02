import { addUserToChatParticipant, addUserToChatRoom, getChatUserList } from "../services/chat.services.js";
import { findUserByMobile } from "../services/user.services.js";

const addToChatController = async (req, res, next) => {
    try {
        const userId = req.headers.userId;
        const anotherUserMobile = req.body.anotherUserMobile;
        const isGroup = req.body.isGroup;
        const groupName = req.body.groupName;
        const groupDescription = req.body.groupDescription;
        const groupAvatar = req.body.groupAvatar;
        const createdBy = req.body.createdBy;
        var anotherUserId = null;

        console.log(`userId >>>>> ${userId}, isGroup >> ${isGroup}`);

        const anotherUserRes = await findUserByMobile(anotherUserMobile);

        if (anotherUserRes.rowCount == 0) {
            return res.status(404).json({ "msg": "The user you are requesting for is not registered" });
        }

        anotherUserId = anotherUserRes.rows[0].id;

        // add this user to chat_rooms
        const addToChatRoomRes = await addUserToChatRoom(isGroup, groupName, groupDescription, groupAvatar, createdBy);

        if (addToChatRoomRes.rowCount > 0) {
            await Promise.all([
                addUserToChatParticipant(addToChatRoomRes.rows[0].id, userId),
                addUserToChatParticipant(addToChatRoomRes.rows[0].id, anotherUserId)
            ]);
            console.log(`addToChatParticipant done -------------`);
        }

        console.log(`db res >>> ${JSON.stringify(addToChatRoomRes)}`);
        res.status(201).json({ "status": 201, "msg": "User added successfully" });
    } catch (e) {
        console.log(`Error occur >>>> ${e}`);
    }
}

const getChatListController = async (req, res, next) => {
    const userId = req.headers.userId;

    // Get all users of my chat
    const chatList = await getChatUserList(userId);

    if (chatList == null || chatList.rowCount <= 0) {
        return res.status(404).json({ 'status': 404, 'msg': "no chat found" });
    }

    return res.status(200).json({ 'status': 200, 'data': chatList.rows });
}

export {addToChatController, getChatListController}