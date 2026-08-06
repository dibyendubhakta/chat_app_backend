/**
 * Handles authentication - login, registration, logout
 */

import { Router } from "express";
import { login, refreshTokenController, register } from "../controllers/auth.controller.js";
import { loginShema, registerShema } from "../validators/auth.validator.js";
import { validate } from "../middelwares/validate.middleware.js";


const router = Router();


router.post('/login', validate(loginShema), login);
router.post('/register', validate(registerShema), register);
router.get('/refersh-token', refreshTokenController);
// router.post('/logout', );
// router.post('/delete-account', );

export default router;