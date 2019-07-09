// APIREST ***********************************************************


//************************** VALIDAR EL JSON-LD POR DEFECTO...............
const jsonData = require('./static/json/carreras.json');

console.log(jsonData.carreras);

let carreras = new Carreras(jsonData.carreras);


// PRUEBAS
//let carrera1 = new Carrera(3,"Travesera", "Picos de Europa");
// let carrera2 = new Carrera(4,"Travesera2", "Picos de Europa");
//
// carreras.add_carrera(carrera1);
// carreras.add_carrera(carrera2);

// console.log(JSON.stringify(carreras));




// GET Todas las Carreras
app.get('/carreras', function (req,res) {

    let data = carreras;

    // Negociación de contenido
    res.format({
        'application/json': (req, res) => {
            res.json(data);
        },
        'text/html': (req, res) => {
            let respuesta = swig.renderFile('views/list.html', {
                datos: data
            });
            res.send(respuesta);
        }
    });
});


// GET Acceder a una Carrera por id
app.get("/carreras/:id", function(req, res) {
    let id = req.params.id;

    let data = carreras.get_carrera(id);

    // Negociación de contenido
    res.format({
        'application/json': (req, res) => {
            res.json(data);
        },
        'text/html': (req, res) => {
            let respuesta = swig.renderFile('views/carrera.html', {
                datos: data[0] // Colección con un sólo item, lógicamente se accede con el 0
            });
            res.send(respuesta);
        }
    });
});


// POST Añadir una carrera
app.post("/carreras", function(req, res) {

    if(req.body.name === null || req.body.name === "")
    {
        res.redirect("/carreras?mensaje=El nombre no puede ser nulo&tipoMensaje=alert-danger");
        return;
    }
    if(req.body.description === null || req.body.description === "")
    {
        res.redirect("/carreras?mensaje=El id no puede ser nulo&tipoMensaje=alert-danger");
        return;
    }


    let event = {
        id: req.body.id,
        name: req.body.name,
        url: req.body.url,
        description: req.body.description,
        startDate: req.body.startDate,
        location: {
            name: req.body.locationName,
            address:{
                addressLocality: req.body.addressLocality,
                addressRegion: req.body.addressRegion
            },
            hashMap: req.body.locationMap
        },
        competitor: []
    };

    let carrera = new Carrera(event.id, event.name, event.url, event.description, event.startDate, event.location, event.competitor);

    carreras.add_carrera(carrera);

    let data = JSON.stringify(carreras, null, 2);

    // Pasar a la capa de persistencia, en próximas versiones se almacenarán los datos en MongoDB


    //************************************************************************** Reescribir en función externa
    fs.writeFile("./static/json/carreras.json", data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Archivo guardado!");
    });
    //***************************************************************************

    console.log(JSON.stringify(carreras));

    //res.send("Carrera añadida!!!");
    res.redirect("/carreras")
});


// PUT (UPDATE) Actualiza una Carrera por id
//************************** PENDIENTE



// DELETE Borrar una Carrera por id
//******************************************* Faltan validación y captura de errores con callback
app.delete("/carreras/:id", function(req, res) {

    let id = req.params.id;

    if (carreras.delete_carrera(id) != null) {
        console.log("Carrera borrada");
        res.sendStatus(204);

    }
    else {
        return res.sendStatus(404);
    }
});





//************************************ MODIFICAR EL CÓDIGO UTILIZANDO CLASES ES6 ;-)
// Nota: Los métodos con el código //comentado// ya están hechos


// // GET Todas las Carreras
// app.get('/carreras', function (req,res) {
//
//     let jsonData = require('./static/json/carreras.json');
//
//     // Negociación de contenido
//     res.format({
//         'application/json': (req, res) => {
//             res.writeHead(200, {'content-type': 'application/json'});
//             res.end(JSON.stringify(jsonData));
//         },
//         'text/html': (req, res) => {
//             let respuesta = swig.renderFile('views/list.html', {
//                 datos: jsonData
//             });
//             res.send(respuesta);
//         }
//     });
//
// });




// GET Una carrera por id
// app.get("/carreras/:id", function(req, res) {
//     let id = req.params.id;
//
//     let jsonData = require('./static/json/carreras.json');
//
//     // Filtrar por id
//     let filtroid = jsonData.carreras.filter(d => d.id == id);
//
//     // Eliminar los corchetes de la colección con un sólo item
//     let data = filtroid[0];
//
//
//     // Negociación de contenido
//     res.format({
//         'application/json': (req, res) => {
//             res.writeHead(200, {'content-type': 'application/json'});
//             res.end(JSON.stringify(data));
//         },
//         'text/html': (req, res) => {
//             let respuesta = swig.renderFile('views/carrera.html', {
//                 datos: data
//             });
//             res.send(respuesta);
//         }
//     });
//
// });



// // POST Añadir una carrera
// app.post("/carreras", function(req, res) {
//     let event = {
//         id: req.body.id,
//         name: req.body.name,
//         description: req.body.description
//     };
//
//     console.log(event);
//
//     let jsonData = require('./static/json/carreras.json');
//
//     jsonData.carreras.push(event);
//
//
//     console.log(jsonData);
//
//
//     let datos = JSON.stringify(jsonData);
//
//
//     fs.writeFile("./static/json/carreras.json", datos, function(err) {
//         if(err) {
//             return console.log(err);
//         }
//         console.log("Archivo guardado!");
//     });
//
//     //res.send("Carrera añadida!!!");
//     res.redirect("/carreras")
// });





// AÑADIR UNA CARRERA **********************(GET CON FORMULARIOS HTML)
// GET Añadir una carrera

app.get("/add_carrera", function(req, res) {
    res.render('eventform', { /* Plantilla */ });
});

// ****************************************************