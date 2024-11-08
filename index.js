// importar dependencias
const express = require('express');
const app = express();
const dotenv = require('dotenv'); // add this line
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');


dotenv.config();
// cargamos configuracion en archivo .env

app.use(cors());

const router = require('./services/crud')

// registramos middleware
app.use(express.json()) // registrar un subcomponente para formato json
app.use(helmet()) // monitoreo para la seguridad
app.use(morgan('common')) // registro de logs


/*
--                                         --
--       ENDPOINT PARA LOS EMPLEADOS       --
--                                         --
--                                         --
*/

// endpoint para retornar todos los empleados
// request, response
// app.get('/apiv2/empleado', getEmpleados);


app.use(router)


app.listen(8800, () => {
    console.log('api corriendo')
});