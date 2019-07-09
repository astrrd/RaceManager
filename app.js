// Racemanager - APIREST NodeJS

// App principal


// Framework Express
const express = require('express'),
    app = express();


// Puerto del servidor
const port = process.env.PORT || 3000;


// Data
// let data = [];
const Competitor = require('./models/Competitor');
const SportsEvent = require('./models/SportsEvent');
const Carreras = require('./models/Carreras');

const listCarreras = new Carreras();



// Módulos
const formidable = require('formidable'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    url = require('url'),
    methodOverride = require("method-override"),
    uniqid = require('uniqid');


// Swig con plantillas ubicadas en el directorio /views
const swig  = require('swig');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


// Headers que se aceptan
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");

    next();
});


// Archivos estáticos en static
app.use(express.static('static'));


// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());



// ROUTES
require("./routes/rcarreras")(app, swig, listCarreras, SportsEvent);
require("./routes/rcorredores")(app, swig, listCarreras);
require("./routes/rcontacto")(app, swig);




// Subir y procesar fichero JSON-LD
app.get('/subirFichero', function (req,res) {
    pideFichero(req,res);
});

app.post('/subirFichero', function (req,res) {
    procesaFichero(req,res);
});

// Funciones para subir y procesar JSON-LD
function pideFichero(req,res) {
    res.render('formFile', { /* Plantilla */ });
}

function procesaFichero(req,res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        fs.readFile(files.fichero.path, 'utf8', (err, datos) => {
            let error = "Error: archivo inválido";
            if(err) {
                console.log(error);
                formaterror(res,req,error);
                return;
            } else {
                try {
                    let json = JSON.parse(datos);

                    validate(req, res, json);

                    let data = JSON.stringify(json, null, 2);

                    // Guardar datos en fichero creado en el directorio static
                    fs.writeFile("./static/json/carreras.json", data, function(err) {
                        if(err) throw err;
                    });


                    // Negociación de contenido
                    res.format({
                        'application/json': (req, res) => {
                            res.writeHead(200, {'content-type': 'application/json'});
                            res.end(JSON.stringify(json));
                        },
                        'text/html': (req, res) => {
                            res.redirect('/sportsevents');
                        }
                    });
                } catch (e) {
                    console.log(e);
                    console.log(error);
                    formaterror(res,req,error);
                    return;
                }
            }
        });
    });
}


function validate(req,res,json) {
    if(json.length === 0)
    {
        let error = "Error: archivo vacío";
        formaterror(res,req,error);
        console.log(error);
        return;
    }
    else if(json.carreras === undefined) {
        let error = "Error: no hay carrera";
        formaterror(res,req,error);
        console.log(error);
        return;
    }
    
    for(c of json.carreras) {
        if(c.name === undefined) {
            let error = "Error: carrera sin nombre";
            formaterror(res,req,error);
            console.log(error);
            return;
        }
        else if(c.location === undefined) {
            let error = "Error: carrera sin localización";
            console.log(error);
            formaterror(res,req,error);
            return;
        }
        else if(c.url === undefined) {
            let error = "Error: carrera sin url";
            console.log(error);
            formaterror(res,req,error);
            return;
        }
        else if(c.description === undefined) {
            let error = "Error: carrera sin descripción";
            console.log(error);
            formaterror(res,req,error);
            return;
        }
        else if(c.startDate === undefined) {
            let error = "Error: carrera sin fecha de inicio";
            console.log(error);
            formaterror(res,req,error);
            return;
        }
        for(cm of c.competitor)
        {
            if(cm.name === undefined) {
                let error = "Error: corredor sin nombre";
                console.log(error);
                formaterror(res,req,error);
                return;
            }
        }
    }

    generateContent(json);

}

function formaterror(res,req,error) {
    try {
            res.redirect('/subirFichero?mensaje=' + error + '&tipoMensaje=alert-danger');
        } catch (e) {
            res.end(e);
        }
}


function generateContent(json) {
    listCarreras.name = json.name;
    
    let id = 0;
    
    for(c of json.carreras) {
        let id = uniqid();
        let name = c.name;
        let url = c.url;
        let description = c.description;
        let startDate = c.startDate;
        let location  = {
            name: c.location.name,
            address:{
                addressLocality: c.location.address.addressLocality,
                addressRegion: c.location.address.addressRegion
            },
            hasMap: c.location.hasMap
        };
        
        let corredores = [];
        
        for (cm of c.competitor) {
            let idc = uniqid();
            corredores.push(new Competitor(idc, cm.name));
        }
        
        listCarreras.add_carrera(new SportsEvent(id, name, url, description, startDate, location, corredores));

        id++;
    }
    console.log(listCarreras.carreras);
}



// INDEX Renderizar index.html con Swig al hacer la petición raíz /
app.get('/', function (req, res) {
    res.render('index', { /* Plantilla */ });
});


// Gestión de errores
app.use( function (err, req, res, next ) {
    console.log("Error producido: " + err); //Mostrar error por consola
    if (! res.headersSent) {
        res.status(400);
        res.redirect("/" +
            "?mensaje=Recurso no disponible" +
            "&tipoMensaje=alert-danger ");
    }
});


// Captura las rutas incorrectas y lanza la página de inicio
app.get('*', (req, res) => {

    if(!res.headersSent){ // Previene de errores ERR_HTTP_HEADERS_SENT
        res.redirect('/');
    }
});



// Servidor
app.listen(port, function() {
    console.log("Servidor activo: http://localhost:" + port);
});
