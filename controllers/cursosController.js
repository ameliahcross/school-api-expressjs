const sql = require('mssql');
const db = require('../database/conexion.js');
const { json } = require('express');

class CursosController {

    constructor() {

    }

    async consultar(req, res) {
        try {
            const allCourses = await sql.query(`SELECT * FROM cursos`);
            if (allCourses.recordset.length === 0) {
                res.status(404).send('No se encontraron registros en la tabla');        
            } else {
                res.status(200).json(allCourses.recordsets);
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
    async consultarDetalle(req, res) {
        const {id} = req.params;
        try {
            const result =  await sql.query(`SELECT * FROM cursos WHERE id=${id}`);
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
        const { nombre, descripcion, profesor_id } = req.body;
        try {
            const query = await db;
            const request = query.request();
            request.input('nombre', sql.VarChar, nombre);
            request.input('descripcion', sql.VarChar, descripcion);
            request.input('profesor_id', sql.VarChar, profesor_id);
            const result = await request.query(`INSERT INTO cursos 
                (nombre, descripcion, profesor_id) OUTPUT INSERTED.* 
                VALUES (@nombre, @descripcion, @profesor_id)`);
            res.status(201).json(result.recordset[0]);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
    async actualizar(req, res) {
        const {id} = req.params;
        const { nombre, descripcion, profesor_id } = req.body;
        try {
            const query = await db;
            const request = query.request();
            request.input('nombre', sql.VarChar, nombre);
            request.input('descripcion', sql.VarChar, descripcion);
            request.input('profesor_id', sql.VarChar, profesor_id);
            const result = await request.query(`
                UPDATE cursos 
                SET nombre = @nombre, descripcion = @descripcion, profesor_id = @profesor_id 
                WHERE id = ${id};
            `);
            if (result.rowsAffected[0] > 0) {
                const newRequest = query.request();
                const showDeletedRow = await newRequest.query(`
                    SELECT * FROM cursos WHERE id = ${id};
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
            const deletion =  await sql.query(`DELETE FROM cursos WHERE id=${id}`);
            if (deletion.rowsAffected == 0) {
                res.status(404).send(`No se encontraron registros con el id ${id}`);
            } else {
                res.status(200).send(`Se ha eliminado el registro con el id ${id}`);
            }
        } catch (error) {
            res.send(error.message);
        }
    }

    async asociarEstudiante(req, res) {
        const { estudiante_id, curso_id } = req.body;
        try {
            const query = await db;
            const request = query.request();
            request.input('curso_id', sql.Int, curso_id);
            request.input('estudiante_id', sql.Int, estudiante_id);
            const result = await request.query(`INSERT INTO cursos_estudiantes
                (curso_id, estudiante_id) OUTPUT INSERTED.* 
                VALUES (@curso_id, @estudiante_id)`);
            res.status(201).json({
                message: 'Estudiante registrado exitosamente',
                row: result.recordset[0]
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

}

 module.exports = new CursosController();