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

    const accessToken = await jwt.sign({ phone, email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE });

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

export async function refreshTokenController(req, res, next) {
    try {
        const refreshToken = req.headers.authorization.split('Bearer ')[1];
        console.log(`authorization >>> ${req.headers.authorization.split('Bearer ')[1]}`);

        const jwtRes = await jwt.verify(refreshToken, process.env.JWT_REFERSH_SECRET_KEY);
        const email = jwtRes.email;

        if (!email) {
            res.status(404).json({ "status": 404, "msg": "User not found" });
        }

        console.log(`email >>> ${jwtRes.email}`);

        const dbRes = await findUserByEmail(email);

        if (dbRes.rowCount == 0) {
            res.status(404).json({ "status": 404, "msg": "User not found" });
        }

        const userId = dbRes.rows[0].id;
        const phone = dbRes.rows[0].phone_number;

        // Generate new access and refresh token
        const accessToken = await jwt.sign({ phone, email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE });

        const refershToken = await jwt.sign({ phone, email }, process.env.JWT_REFERSH_SECRET_KEY, { expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE });

        return res.status(200).json({ ...user.rows[0], accessToken: accessToken, refershToken: refershToken, msg: "Login success" });
    } catch (e) {
        console.log(`Error occur ${JSON.stringify(e)}`);
        res.status(401).json({ "status": 401, "msg": "Authentication failed" });
    }
}