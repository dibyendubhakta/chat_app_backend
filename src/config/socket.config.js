import { Server, Socket } from "socket.io";
import dbClient from "./db.config.js";
import { getAllUsersFromChatRoom } from "../services/chat.services.js";

function initializeSocket(server) {
    const io = new Server(server, {
        path: "/socket.io"
    });

    io.on("connection", (client) => {
        console.log("Socket connected:", client.id);

        // Partition by user 
        /*
        client.on("join-room", (data, callback) => {
            console.log(`join-room data >> ${data.room_id}`);
            client.join(`groupChat${data.room_id}`);

            // check if the roomID exist or creaet one

            callback({
                status: 200,
                msg: "join to group successfully"
            })
        });
        */

        // ======================= Partition by Chat =====================
        client.on('join-chat-channel', async (data, callback) => {
            // Join user to its user based channel
            client.join(`chat_${data.user_id}`, (data, callback) => {
                callback({
                    status: 200,
                    msg: "join to chat channel successfully"
                })
            });
        });

        // New message received
        client.on("newMessage", async (data, callback) => {
            // Get data from new message
            const sender_id = data.sender_id;
            const room_id = data.room_id;
            const msg = data.content;
            const type = data.type;
            console.log(`new message sender_id >> ${data.sender_id}, room_id >> ${room_id}, msg >> ${msg}, type >> ${type}`);

            // find all users in that room
            const roomUsersRes = await getAllUsersFromChatRoom(room_id);
            const roomUsers = Array.from(roomUsersRes.rows.map((user) => user.user_id));

            console.log(`room users >> ${roomUsers}`);

            roomUsers.forEach((userId) => {
                if (userId == sender_id) return;
                client.to(`chat_${userId}`).emit('receiveMessage', {...data});
            })

            callback({
                status: 200,
                msg: "Message send successfully"
            })

            // Loop through that user list and send message to everyone except this user

        })

        /// ========================================================


        client.on("sendMessage", async (data, callback) => {
            const sender_id = data.sender_id;
            const room_id = data.room_id;
            const msg = data.content;
            const type = data.type;
            console.log(`sendMessage sender_id >> ${data.sender_id}, room_id >> ${room_id}, msg >> ${msg}, type >> ${type}`);

            const messageStoreQuery = `INSERT INTO 
            messages(type, content, chat_room_id, sender_id) 
            VALUES($1, $2, $3, $4)`;

            const result = await dbClient.query(messageStoreQuery, [type, msg, room_id, sender_id]);
            // Notifiy others about the latest message
            client.to(`groupChat${data.room_id}`).emit("messages", {
                "type": type,
                "content": msg,
                "room_id": room_id,
                "sender_id": sender_id
            });

            console.log(`Rooms >> ${client.rooms}`);

            // Acknowledge
            callback({
                success: true,
                msg: "messages saved successfully"
            })
        });


        client.on("disconnect", () => {
            console.log("--------- Socket disconnect -----------");
        });
    });

    return io;
}

export default initializeSocket;


/* 
How to optimize your server so it doesn't crash under the weight of millions of messages.
The Two Strategies

1. Partition by User (The Personal Mailbox)

How it works: Your Flutter app connects and listens to exactly one room (its own User ID).

Sending a message: If you send a message to a group of 100 people, the server has to loop through 99 users and manually 
drop the message into 99 individual mailboxes.

The tradeoff: It's incredibly cheap for the server to listen (only 1 connection per user), but expensive to send to large groups.



2. Partition by Chat (The Shared P.O. Box)

How it works: Your app connects and subscribes to a room for every single chat you are part of. 
If you have 250 active chats, you are listening to 250 rooms simultaneously.

Sending a message: If you send a message to a group of 100 people, the server just drops it in the one shared P.O. Box. 
Socket.IO automatically handles distributing it to the 100 people listening.

The tradeoff: It's incredibly cheap for the server to send to groups, but very heavy on memory because the server has 
to keep hundreds of socket subscriptions open for every single connected user.



--- Why WhatsApp Prefers "By User" ---
The text points out that most chat apps (like WhatsApp) are dominated by 1:1 conversations.

If you use the "By Chat" method for a user with 250 mostly 1:1 chats, 
your server is maintaining 250 active subscriptions for that user just to receive occasional messages. 
It wastes a massive amount of server memory for very little benefit.
Because of this, the Partition by User method (what we set up in the previous step) is the universally accepted default for modern chat apps.



--- The "Celebrity Problem" (The Hybrid Solution) ---
At the end, the text brings up a senior-level optimization. What happens when someone is in a massive group chat with 10,000 people?

If you only use "Partition by User," every time someone says "Hello" in that massive group, your Node.js server has to run a 
loop 10,000 times to emit the message to every single individual. That will block your server's event loop and slow everything down.

The Solution: Use both.

By default, everyone just listens to their own Personal Room (for 1:1s and small groups).
You set a threshold in your code (e.g., 25 users).
If a group chat has more than 25 users, you tell the app to also subscribe specifically to that group's room.
*/