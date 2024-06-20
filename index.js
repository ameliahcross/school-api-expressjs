const express = require('express');
const app = express();
const estudiantesRoutes = require('./routes/estudiantesRoutes.js');
const profesoresRoutes = require('./routes/profesoresRoutes.js');
const cors = require('cors');
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hola Mundo');
})

app.use('/estudiantes', estudiantesRoutes);
app.use('/profesores', profesoresRoutes);

app.listen(6500, () => {
    console.log('Servidor activo');
});