const mssql = require('mssql');
require('dotenv').config();

const mssqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT), 
    database: process.env.DB_DATABASE,
    options: {
        trustServerCertificate: true,
        encrypt: true
    }
};

async function connectToDatabase() {
    try {
        const dbConnection = await mssql.connect(mssqlConfig);
        console.log('Base de datos conectada: MS SQL Server');
        return dbConnection;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    }
}

module.exports = connectToDatabase();