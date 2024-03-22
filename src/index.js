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
        console.error("Error connecting to database: ", error);
        return null;
    }
};

//ENDPOINTS
//Get all recipes
server.get('/api/recetas', async (req, res) => {

    try {
        const conn = await getConnection();

        const queryAllRecipes = 'SELECT * FROM recetas;';

        const [results] = await conn.query(queryAllRecipes);

        conn.end();

        res.json({
            info: { count: results.length },
            results: results
        });

    } catch (error) {
        res.json(createErrorResponse('Error connecting to database. ' + error));
    }
});

//Get one recipe by id
server.get('/api/recetas/:id', async (req, res) => {

    try {
        const id = req.params.id;

        const conn = await getConnection();

        const queryAllRecipes = 'SELECT * FROM recetas WHERE id = ?;';

        const [results] = await conn.query(queryAllRecipes, [id]);

        conn.end();

        res.json(results[0]);

    } catch (error) {
        res.json(createErrorResponse('Error connecting to database. ' + error));
    }
});

//Post a recipe
server.post('/api/recetas', async (req, res) => {

    try {
        //Validate the parameters
        if (!req.body.nombre || req.body.nombre === '') {
            return res.status(400).json(createErrorResponse('El nombre de la receta es obligatorio.'));
        } else if (!req.body.ingredientes || req.body.ingredientes === '') {
            return res.status(400).json(createErrorResponse('Los ingredientes de la receta son obligatorios.'));
        } else if (!req.body.instrucciones || req.body.instrucciones === '') {
            return res.status(400).json(createErrorResponse('Las instrucciones de la receta son obligatorias.'));
        }

        //Connect to the database
        const conn = await getConnection();

        const insertRecipeSql = 'INSERT INTO recetas(nombre, ingredientes, instrucciones) VALUES (?, ?, ?);';

        const [results] = await conn.execute(insertRecipeSql, [req.body.nombre, req.body.ingredientes, req.body.instrucciones]);

        conn.end();

        res.json({
            success: true,
            id: results.insertId
        });

    } catch (error) {
        res.json(createErrorResponse('Error connecting to database. ' + error));
    }
});

const createErrorResponse = (message) => {
    return {
        success: false,
        message: message
    };
};
