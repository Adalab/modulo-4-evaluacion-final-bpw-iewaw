//LIBRARY IMPORTS
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

//VARIABLES
const server = express();
const port = 4000;

//SERVER CONFIG
server.use(cors());
server.use(express.json({ limit: '25Mb' }));

//RUN SERVER
server.listen(port, () => {
    console.log(`Recipe server started at <http://localhost:${port}>`);
});

//DB CONFIG
const getConnection = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_DATABASE || 'recetas_db'
        });

        await connection.connect();
        console.log(`Connected to database, thread id: ${connection.threadId}`);
        return connection;

    } catch (error) {
        console.error("Error connecting to database:", error);
        return null;
    }
};

//ENDPOINTS
server.get('/api/recetas', async (req, res) => {

    const conn = await getConnection();

    const queryAllRecipes = 'SELECT * FROM recetas;';

    const [results] = await conn.query(queryAllRecipes);

    res.json({
        "info": { "count": results.length },
        "results": results
    });

    conn.end();
});
