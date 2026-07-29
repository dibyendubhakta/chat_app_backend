import dbClient from "../config/db.config.js";

const login = async (req, res) => {
    const { phone, password } = req.body;

    try {
        console.log("login run -------------------------------");
        res.status(200).json({ message: 'Login successful' });


    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const register = async (req, res) => {
    try {
        const { first_name, last_name, phone, email } = req.body;
        console.log(`register run >> ${req.body}`);

        const inserQuery = `INSERT INTO users 
            (first_name, last_name, phone_number, email)
            VALUES 
            ($1, $2, $3, $4)`;

        await dbClient.query(inserQuery, [first_name, last_name, phone, email]);


        res.status(200).json({ message: 'Login successful' });


    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const seeAll = async (req, res) => {
    try {
        const getAllQuery = `SELECT * FROM users`;

        const allUser = await dbClient.query(getAllQuery);

        console.log(`all users >> ${allUser}`);
        


        res.status(200).json({ data: allUser["rows"], message: 'Login successful' });


    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export { login, register, seeAll };