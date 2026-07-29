import Router from 'express';
import { login, register, seeAll } from '../controllers/user_controller.js';
import { createChatRoom } from '../controllers/chat_room_controller.js';
import { sendMessage } from '../controllers/message_controller.js';
import authRoutes from './auth.routes.js';
import chatRoutes from './message.routes.js'

const router = Router();

/*
GET /users - Get all users
POST /users - Create a new user
GET /users/:id - Get a specific user by ID
PUT /users/:id - Update a specific user by ID
DELETE /users/:id - Delete a specific user by ID


GET /chat_rooms - Get all chat rooms
POST /chat_rooms - Create a new chat room
GET /chat_rooms/:id - Get a specific chat room by ID
PUT /chat_rooms/:id - Update a specific chat room by ID
DELETE /chat_rooms/:id - Delete a specific chat room by ID

GET /messages - Get all messages
POST /messages - Create a new message
GET /messages/:id - Get a specific message by ID
PUT /messages/:id - Update a specific message by ID
DELETE /messages/:id - Delete a specific message by ID
*/


router.get('/users', login);
router.post('/users/register', register);
router.get('/users/seeAll', seeAll);

// router.post('/chat', createChatRoom);
router.post('/sendMessage', sendMessage);

// NEW routes
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);

export default router;