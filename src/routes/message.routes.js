import { Router } from "express";
import { validate } from "../middelwares/validate.middleware.js";
import { addToChatController, getChatListController } from "../controllers/message.controller.js";
import { authenticate } from "../middelwares/authenticate.middleware.js";

const router = Router();


router.post('/add-to-chat', authenticate, addToChatController);
router.get('/get-all-chats', authenticate, getChatListController);

export default router;