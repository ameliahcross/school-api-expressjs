const sql = require('mssql');
const db = require('../database/conexion.js');
const { json } = require('express');

class EstudiantesController {

    constructor() {

    }

    async consultar(req, res) {
        try {
            const allStudents = await sql.query(`SELECT * FROM estudiantes`);
            if (allStudents.recordset.length === 0) {
                res.status(404).send('No se encontraron registros en la tabla');        
            } else {
                res.status(200).json(allStudents.recordsets);
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async consultarDetalle(req, res) {
        const {id} = req.params;
        try {
            const result =  await sql.query(`SELECT * FROM estudiantes WHERE id=${id}`);
            if (result.recordset.length === 0) {
                res.status(404).send(`No se encontraron registros con el id ${id}`);
            } else {
                res.status(200).json(result.recordsets);
            }
        } catch (error) {
            res.send(error.message);
        }
    }
    
    async ingresar(req, res) {
        const { cedula, nombre, apellido, email } = req.body;
        try {
            const query = await db;
            const request = query.request();
            request.input('cedula', sql.VarChar, cedula);
            request.input('nombre', sql.VarChar, nombre);
            request.input('apellido', sql.VarChar, apellido);
            request.input('email', sql.VarChar, email);
            const result = await request.query(`INSERT INTO estudiantes 
                (cedula, nombre, apellido, email) OUTPUT INSERTED.* 
                VALUES (@cedula, @nombre, @apellido, @email)`);
            res.status(201).json(result.recordset[0]);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async actualizar(req, res) {
        const {id} = req.params;
        const { cedula, nombre, apellido, email } = req.body;
        try {
            const query = await db;
            const request = query.request();
            request.input('cedula', sql.VarChar, cedula);
            request.input('nombre', sql.VarChar, nombre);
            request.input('apellido', sql.VarChar, apellido);
            request.input('email', sql.VarChar, email);
            const result = await request.query(`
                UPDATE estudiantes 
                SET cedula = @cedula, nombre = @nombre, apellido = @apellido, email = @email 
                WHERE id = ${id};
            `);
            if (result.rowsAffected[0] > 0) {
                const newRequest = query.request();
                const showDeletedRow = await newRequest.query(`
                    SELECT * FROM estudiantes WHERE id = ${id};
                    `)
                res.status(200).json({
                    msg: `Registro con id ${id} actualizado exitosamente` ,
                    registroActualizado: showDeletedRow.recordset[0]
                });
            } else {
                res.status(404).json({ msg: `No se encontró ningún registro con el id ${id}` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async borrar(req, res) {
        const {id} = req.params;
        try {
            const deletion =  await sql.query(`DELETE FROM estudiantes WHERE id=${id}`);
            if (deletion.rowsAffected == 0) {
                res.status(404).send(`No se encontraron registros con el id ${id}`);
            } else {
                res.status(200).send(`Se ha eliminado el registro con el id ${id}`);
            }
        } catch (error) {
            res.send(error.message);
        }
    }

}

 module.exports = new EstudiantesController();