module.exports = function(app, swig,carr) {

    const Carrerafile = require('../models/Carrera.js');
    const Carrera = Carrerafile.Carrera;


    app.get("/sportsevents", function(req, res) {

        carreras = carr.carreras;
        if(carreras.length ===0)
        {
            res.redirect('/subirFichero?mensaje=Suba un fichero&tipoMensaje=alert-danger')
        }
        else
        {
            var respuesta = swig.renderFile('views/listevent.html', {

                datos:carreras
            });
            res.send(respuesta);
        }

    });

// GET Una formulario para añadir carrera
    app.get("/sportsevent", function(req, res) {

        var respuesta = swig.renderFile('views/eventform.html',{}
        );
        res.send(respuesta);
    });
    // POST Añadir carrera

    app.post("/sportsevent", function(req, res) {


        if(req.body.name === null || req.body.name === "")
        {
            res.redirect("/sportsevent?mensaje=El nombre no puede ser nulo&tipoMensaje=alert-danger");
            return;
        }
        if(req.body.description === null || req.body.description === "")
        {
            res.redirect("/sportsevent?mensaje=El id no puede ser nulo&tipoMensaje=alert-danger");
            return;
        }
        let id = uniqid();
        let event = {
            name: req.body.name,
            description: req.body.description,
            url: req.body.url,
            startDate: req.body.startDate,
            competitor:[],
            location: {
                name: req.body.locationName,
                address:{
                    addressLocality: req.body.addressLocality,
                    addressRegion: req.body.addressRegion
                },
                hashMap: req.body.locationMap
            }
        };

        carr.add_carrera(new Carrera(event.name,id,event.url,event.description,event.startDate,event.competitor, event.location));


        res.redirect("/sportsevents");
    });

// GET Una carrera por id
    app.get("/sportsevents/:id", function(req, res) {
        let id = req.params.id;
        let filtroid = carr.get_carrera(id);

        if( filtroid.length ===0)
        {
            res.redirect('/sportsevents?mensaje=Carrera no encontrada&tipoMensaje=alert-danger')

        }
        else
        {
            var respuesta = swig.renderFile('views/listevent.html', {
                datos: filtroid
            });
            res.send(respuesta);
        }

    });


// GET formulario para actualizar por id

    app.get("/sportsevent/:id", function(req, res) {
        let id = req.params.id;
        let filtroid = carr.get_carrera(id);
        if( filtroid.length ===0)
        {
            res.redirect('/sportsevents?mensaje=Carrera no encontrada&tipoMensaje=alert-danger')

        }
        else
        {
            var respuesta = swig.renderFile('views/updateForm.html', {
                id : id
            });
            res.send(respuesta);
        }
    });
    // PUT Actualiza carrera

    app.post("/sportsevent/:id", function(req, res) {

        if(req.body.name === null || req.body.name === "")
        {
            res.redirect("/sportsevent?mensaje=El nombre no puede ser nulo&tipoMensaje=alert-danger");
            return;
        }
        if(req.body.description === null || req.body.description === "")
        {
            res.redirect("/sportsevent?mensaje=Description no puede ser nulo&tipoMensaje=alert-danger");
            return;
        }
        let id = req.params.id;
        let event = {
            name: req.body.name,
            description: req.body.description,
            url: req.body.url,
            startDate: req.body.startDate,
            competitor:[],
            location: {
                name: req.body.locationName,
                address:{
                    addressLocality: req.body.addressLocality,
                    addressRegion: req.body.addressRegion
                },
                hashMap: req.body.locationMap
            }
        };
        carr.update_carrera(id,new Carrera(event.name,event.url,id,event.description,event.startDate,event.competitor, event.location));


        res.redirect("/sportsevents");
    });
    app.post("/dsportevent/:id", function(req, res) {

        let id = req.params.id;

        carr.delete_carrera(id)
        console.log("Carrera borrada");
        res.sendStatus(204);
        res.redirect('/');

    });

};