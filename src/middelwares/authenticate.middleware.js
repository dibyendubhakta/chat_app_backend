import jwt from "jsonwebtoken";
import dbClient from "../config/db.config.js";
import { email } from "zod";

export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        console.log(`authorization >>> ${req.headers.authorization.split('Bearer ')[1]}`);

        const jwtRes = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        const email = jwtRes.email;

        console.log(`email >>> ${jwtRes.email}`);

        const getThisUser = `SELECT * FROM users where email = $1`;

        const dbRes = await dbClient.query(getThisUser, [email]);
        const userId = dbRes.rows[0].id;

        req.headers.userId = userId;
        next();
    } catch (e) {
        console.log(`Error occur ${JSON.stringify(e)}`);
        res.status(401).json({"status":401, "msg": "Authentication failed"});
    }
}