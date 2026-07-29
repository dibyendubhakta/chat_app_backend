/**
 * Authentication controller
 */

import dbClient from "../config/db.config.js";
import jwt from "jsonwebtoken"
import { createUser, findUserByEmail } from "../repositories/user.repository.js";

/**
 * Handles login
 */
export async function login(req, res, next) {
    const { email, passsword } = req.body;

    // await createUser({ name, phone, email });
    const user = await findUserByEmail(email);
    

    if (user == null || user.rowCount == 0) {
        return res.status(200).json({ msg: "User not found" })
    }
    const phone = user.fields.phone;

    const accessToken = await jwt.sign({ phone, email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env. JWT_ACCESS_TOKEN_LIFE });

    const refershToken = await jwt.sign({ phone, email }, process.env.JWT_REFERSH_SECRET_KEY, { expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE });

    return res.status(200).json({ ...user.rows[0], accessToken: accessToken, refershToken: refershToken, msg: "Login success" });
}


export async function register(req, res, next) {
    const { name, phone, email, passsword } = req.body;

    // await createUser({ name, phone, email });
    const user = await findUserByEmail(email);

    if (user != null && user.rowCount != 0) {
        return res.status(200).json({ msg: "Email or password is incorrect" })
    }

     const createdUser = await createUser(req.body);

    const accessToken = await jwt.sign({ phone, email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE });

    const refershToken = await jwt.sign({ phone, email }, process.env.JWT_REFERSH_SECRET_KEY, { expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE });

    return res.status(200).json({ ...createUser, accessToken: accessToken, refershToken: refershToken, msg: "Login success" });
}