import dbClient from "../config/db.config.js";

export const createUser = async (loginShema) => {
    try {
        const inserQuery = `INSERT INTO users 
            (name, phone_number, email)
            VALUES 
            ($1, $2, $3)`;

        return await dbClient.query(inserQuery, [loginShema.name, loginShema.phone, loginShema.email]);
    } catch (e) {
        console.log(`Error creating user >> ${e}`);
    }
}

export const findUserByEmail = async (email) => {
    try {
        const inserQuery = `SELECT * FROM users WHERE email = $1`;

        return await dbClient.query(inserQuery, [email]);
    } catch (e) {
        console.log(`Error finding user >> ${e}`);
    }
}