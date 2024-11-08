const {Router} = require('express')
const mysql = require('mysql');


const router = Router()

// preparar a mysql
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA
});


const getEmpreados = (req, res) =>{
    connection.query('Select * FROM empleado', function(error, rows, fields) {
        if (error) {
            res.status(500).json(error)
        } else {
            res.status(200).json(rows)
        }
    });
}


//devolver salrio empleado
const devolverSalario = (req, res) => {
    connection.query('Select * FROM empleado', function(error, rows, fields) {
        if (error) {
            res.status(500).json(error)
        } else {
            res.status(200).json(rows)
        }
    });
}

//endpoint devolucion de un empleado
const getEmpleado = (req, res) => {
    id = req.params.numero;
    connection.query('Select * FROM empleado Where idempleado = ?', id, function(error, rows, fields) {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(rows);
        }
    });
}


//borrar un empleado
const borrarEmpleado  = (req, res) => {
    id = req.params.numero;
    connection.query('Delete FROM empleado Where idempleado = ?', id, function(error, rows, fields) {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json({message:"registro eliminado"});
        }
    });
}


//endpoint  actualizar de un empleado
const actualizarEmpleado = (req, res) => {
    id = req.params.numero;
    empleado = req.body;

    connection.query('Update empleado Set ? Where idempleado = ?', [empleado,id], function(error, rows, fields) {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json({message:"registro actualizado"});
        }
    });
}



// Endpoint para insertar un nuevo empleado
const crearEmpleado = (req, res) => {
    nuevoemple = req.body;

   connection.query('INSERT INTO empleado SET ?', nuevoemple, function(error, results, fields) {
       if (error) {
           res.status(500).json(error);
       } else {
           res.status(201).json({ message: "Empleado nuevo creado", id: results.insertId });
       }
   });
}

/* 
Calcular el salario total
Este endpoint recibirá bonos y descuentos y devolverá el total del salario
*/

const calcularSaldoTotal = (req, res) => {
    const { idempleado } = req.params;  // Obtenemos el ID del empleado de los parámetros de la URL
    const { bonos, descuentos } = req.body;  // Obtenemos bonos y descuentos del cuerpo de la solicitud

    connection.query('SELECT salario_base FROM empleado WHERE idempleado = ?', [idempleado], (error, rows) => {
        if (error) {
            return res.status(500).json(error);
        }
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        const salario_base = rows[0].salario_base;
        const total_salario = salario_base + bonos - descuentos;

        res.status(200).json({ total_salario });
    });
}


/*
Este endpoint recibirá venta_mensual y devolverá el 5% de esa venta
Calcular la comisión
 */

const descuentoVentaMensual = (req, res) => {
    const { venta_mensual } = req.body;
    const comision = venta_mensual * 0.05;

    res.status(200).json({ comision });
}

/*
Endpoint para Calcular la Comisión
Este endpoint devolverá el total de empleados en la tabla
Contar total de empleados
*/


const calcularComision = (req, res) => {
    connection.query('SELECT COUNT(*) AS total_empleados FROM empleado', (error, rows) => {
        if (error) {
            return res.status(500).json(error);
        }

        res.status(200).json({ total_empleados: rows[0].total_empleados });
    });
}

/*
Endpoint para Contar los Empleados
Este endpoint devolverá el total de empleados en la tabla
*/


const comision = (req, res) => {
    const { venta_mensual } = req.body;
    const comision = venta_mensual * 0.05;

    res.status(200).json({ comision });
}


/*
Endpoint para Contar los Empleados
Este endpoint devolverá el total de empleados en la tabla.
 */


const totalEmpleados = (req, res) => {
    connection.query('SELECT COUNT(*) AS total_empleados FROM empleado', (error, rows) => {
        if (error) {
            return res.status(500).json(error);
        }

        res.status(200).json({ total_empleados: rows[0].total_empleados });
    });
}

/*
Endpoint para Obtener Empleados con el Nombre de la Sucursal
Este endpoint devolverá todos los empleados con el nombre de la sucursal a la que pertenecen
 */


// Obtener empleados con el nombre de la sucursal
const getEmpleadoPorSucursal = (req, res) => {
    const sql = `
        SELECT e.*, s.nombre AS nombre_sucursal
        FROM empleado e
        INNER JOIN sucursal s ON e.idsucursal = s.idsucursal
    `;

    connection.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json(error);
        }

        res.status(200).json(rows);
    });
}


/*
--                                         --
--       ENDPOINT PARA SUCURSAL            --
--                                         --
--                                         --
*/

// Obtener todas las sucursales
const getSucursales = (req, res) => {
    connection.query('SELECT * FROM sucursal', function(error, rows, fields) {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(rows);
        }
    });
}

// Insertar una nueva sucursal
const crearSucursal = (req, res) => {
    const nuevaSucursal = req.body;
    connection.query('INSERT INTO sucursal SET ?', nuevaSucursal, function(error, results, fields) {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(201).json({ message: "Sucursal creada", id: results.insertId });
        }
    });
}

// Actualizar una sucursal
const actualizarSucursal = (req, res) => {
    const id = req.params.idsucursal;
    const sucursal = req.body;
    connection.query('UPDATE sucursal SET ? WHERE idsucursal = ?', [sucursal, id], function(error, results, fields) {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json({ message: "Sucursal actualizada" });
        }
    });
}

// Eliminar una sucursal
const eliminarSucursal = (req, res) => {
    const id = req.params.idsucursal;
    connection.query('DELETE FROM sucursal WHERE idsucursal = ?', id, function(error, results, fields) {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json({ message: "Sucursal eliminada" });
        }
    });
}


router.get('/apiv2/empleado', getEmpreados)
router.get('/apiv2/empleado/salario', devolverSalario)

router.get("/apiv2/empleado", getEmpleado);
router.delete("/apiv2/empleado/:numero", borrarEmpleado);
router.put("/apiv2/empleado/:numero", actualizarEmpleado);
router.post('/apiv2/empleado', crearEmpleado);
router.post('/apiv2/empleado/salario/:idempleado', calcularSaldoTotal);

router.post('/apiv2/empleado/comision', descuentoVentaMensual);
router.get('/apiv2/empleado/conteo', calcularComision);

router.post('/apiv2/empleado/comision', comision);
router.get('/apiv2/empleado/conteo', totalEmpleados);
router.get('/apiv2/empleado/empleadosucursal', getEmpleadoPorSucursal);

//sucursales
router.get('/apiv2/sucursal', getSucursales);
router.post('/apiv2/sucursal', crearSucursal);
router.put('/apiv2/sucursal/:idsucursal',actualizarSucursal);
router.delete('/apiv2/sucursal/:idsucursal', eliminarSucursal);

module.exports = router;