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
        console.error(error);
        res.json(createErrorResponse('Error connecting to database.'));
    }
});

//Get one recipe by id
server.get('/api/recetas/:id', async (req, res) => {

    try {
        const conn = await getConnection();

        const queryAllRecipes = 'SELECT * FROM recetas WHERE id = ?;';

        const [results] = await conn.query(queryAllRecipes, [req.params.id]);

        conn.end();

        res.json(results[0]);

    } catch (error) {
        console.error(error);
        res.json(createErrorResponse('Error connecting to database.'));
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
        console.error(error);
        res.json(createErrorResponse('Error connecting to database.'));
    }
});

//Update a recipe
server.put('/api/recetas/:id', async (req, res) => {

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

        const updateRecipeSql = `UPDATE recetas SET nombre = ?, ingredientes = ?, instrucciones = ? WHERE id = ?`;

        const [results] = await conn.execute(updateRecipeSql, [req.body.nombre, req.body.ingredientes, req.body.instrucciones, req.params.id]);

        conn.end();

        res.json({
            success: true
        });

    } catch (error) {
        console.error(error);
        res.json(createErrorResponse('Error connecting to database.'));
    }
});

//Delete one recipe by id
server.delete('/api/recetas/:id', async (req, res) => {

    try {
        const conn = await getConnection();

        const queryAllRecipes = 'DELETE FROM recetas WHERE id = ?;';

        const [results] = await conn.query(queryAllRecipes, [req.params.id]);

        conn.end();

        res.json({
            success: true
        });

    } catch (error) {
        console.error(error);
        res.json(createErrorResponse('Error connecting to database.'));
    }
});

//Error response function
const createErrorResponse = (message) => {
    return {
        success: false,
        message: message
    };
};
