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

    let connection;

    try {
        //Connect to the database
        connection = await getConnection();

        const queryAllRecipes = 'SELECT * FROM recetas;';

        const [results] = await connection.query(queryAllRecipes);

        //Send response
        res.json({
            info: { count: results.length },
            results: results
        });

    } catch (error) {
        console.error(error);
        res.json(createErrorResponse('Error connecting to database.'));
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

//Get one recipe by id
server.get('/api/recetas/:id', async (req, res) => {

    let connection;

    try {
        //Connect to the database
        connection = await getConnection();

        const queryAllRecipes = 'SELECT * FROM recetas WHERE id = ?;';

        const [results] = await connection.query(queryAllRecipes, [req.params.id]);

        //Validate id presence
        if (results.length === 0) {
            return res.status(404).json(createErrorResponse('No existe ninguna receta con este id en la base de datos.'));
        }

        //Send response
        res.json(results[0]);

    } catch (error) {
        console.error(error);
        res.json(createErrorResponse('Error connecting to database.'));
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

//Post a recipe
server.post('/api/recetas', async (req, res) => {

    let connection;

    try {
        //Validate parameters
        const validationError = validateReqBody(req);
        if (validationError) {
            return res.status(400).json(createErrorResponse(validationError));
        }

        //Connect to the database
        connection = await getConnection();

        const insertRecipeSql = 'INSERT INTO recetas(nombre, ingredientes, instrucciones) VALUES (?, ?, ?);';

        const [results] = await connection.execute(insertRecipeSql, [req.body.nombre, req.body.ingredientes, req.body.instrucciones]);

        //Send response
        res.json({
            success: true,
            id: results.insertId
        });

    } catch (error) {
        console.error(error);
        res.json(createErrorResponse('Error connecting to database.'));
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

//Update a recipe
server.put('/api/recetas/:id', async (req, res) => {

    let connection;

    try {
        //Validate parameters
        const validationError = validateReqBody(req);
        if (validationError) {
            return res.status(400).json(createErrorResponse(validationError));
        }

        //Connect to the database
        connection = await getConnection();

        const updateRecipeSql = `UPDATE recetas SET nombre = ?, ingredientes = ?, instrucciones = ? WHERE id = ?`;

        const [results] = await connection.execute(updateRecipeSql, [req.body.nombre, req.body.ingredientes, req.body.instrucciones, req.params.id]);

        //Validate id presence
        if (results.affectedRows === 0) {
            return res.status(404).json(createErrorResponse('No existe ninguna receta con este id en la base de datos.'));
        }

        //Send response
        res.json({
            success: true
        });

    } catch (error) {
        console.error(error);
        res.json(createErrorResponse('Error connecting to database.'));
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

//Delete one recipe by id
server.delete('/api/recetas/:id', async (req, res) => {

    let connection;

    try {
        //Connect to the database
        const connection = await getConnection();

        const queryAllRecipes = 'DELETE FROM recetas WHERE id = ?;';

        const [results] = await connection.query(queryAllRecipes, [req.params.id]);

        //Validate id presence
        if (results.affectedRows === 0) {
            return res.status(404).json(createErrorResponse('No existe ninguna receta con este id en la base de datos.'));
        }

        //Send response
        res.json({
            success: true
        });

    } catch (error) {
        console.error(error);
        res.json(createErrorResponse('Error connecting to database.'));
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

//Error response function
const createErrorResponse = (message) => {
    return {
        success: false,
        message: message
    };
};

//Params validation function
const validateReqBody = (req) => {
    if (!req.body.nombre || req.body.nombre === '') {
        return 'El nombre de la receta es obligatorio.';
    } else if (!req.body.ingredientes || req.body.ingredientes === '') {
        return 'Los ingredientes de la receta son obligatorios.';
    } else if (!req.body.instrucciones || req.body.instrucciones === '') {
        return 'Las instrucciones de la receta son obligatorias.';
    }
};