//LIBRARY IMPORTS
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

//VARIABLES
const server = express();
const port = 4000;

//CONFIG
server.use(cors());
server.use(express.json({ limit: '25Mb' }));

//RUN
server.listen(port, () => {
    console.log(`Recipe server started at <http://localhost:${port}>`);
})
