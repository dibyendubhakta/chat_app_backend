import dbClient from "../config/db.config.js";

const findUserByMobile = async (mobileNo) => {
    const dbQuery = `SELECT * FROM users WHERE phone_number = $1`;
    return await dbClient.query(dbQuery, [mobileNo]);
}

export {findUserByMobile};