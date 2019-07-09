module.exports = function(app, swig, listCarreras, SportsEvent) {
      // GET Todas las Carreras
    app.get("/sportsevents", function(req, res) {

        let carreras = listCarreras.carreras;

        if(carreras == null || carreras.length === 0) {
            console.log('Hay que subir un archivo json-ld');
            res.redirect('/subirFichero?mensaje=Suba un fichero&tipoMensaje=alert-danger');
        }
        else {
            let respuesta = swig.renderFile('views/listevent.html', {
                datos: carreras
            });

            res.send(respuesta);
        }
    });


    // GET Una carrera por id
    app.get("/sportsevents/:id", function(req, res) {
        let id = req.params.id;

        let filtroid = listCarreras.get_carrera(id);

        if( filtroid == null  || filtroid.length === 0) {
            res.redirect('/sportsevents?mensaje=Carrera no encontrada&tipoMensaje=alert-danger');
        }
        else {
            let respuesta = swig.renderFile('views/carrera.html', {
                datos: filtroid
            });
            res.send(respuesta);
        }

    });


    // POST Añadir una carrera
    app.post("/sportsevents", function(req, res) {
        if(req.body.name === null || req.body.name === "") {
            res.redirect("/sportsevents?mensaje=El nombre no puede ser nulo&tipoMensaje=alert-danger");
            return;
        }
        if(req.body.description === null || req.body.description === "") {
            res.redirect("/sportsevents?mensaje=El id no puede ser nulo&tipoMensaje=alert-danger");
            return;
        }
        let id = require('uniqid');

        let event = {
            name: req.body.name,
            description: req.body.description,
            url: req.body.url,
            startDate: req.body.startDate,
            location: {
                name: req.body.locationName,
                address:{
                    addressLocality: req.body.addressLocality,
                    addressRegion: req.body.addressRegion
                },
                hasMap: req.body.locationMap
            },
            competitor: []
        };

        listCarreras.add_carrera(new SportsEvent(id, event.name, event.url, event.description, event.startDate, event.location, event.competitor));


        res.redirect("/sportsevents");
    });


    // DELETE Borrar una Carrera por id
    app.delete("/sportsevent/:id", function(req, res) {
        // *********************** FALTA NEGOCIACIÓN DE CONTENIDO -> HTML Y JSON
        console.log('deleteee')
        let id = req.params.id;
        console.log(id)
        listCarreras.delete_carrera(id)

            console.log("Carrera borrada");
            res.sendStatus(204);


    });


// GET formulario para actualizar por id

    app.get("/sportsevent/:id", function(req, res) {
        let id = req.params.id;

            var respuesta = swig.renderFile('views/updateForm.html', {
                _id : id
            });
            res.send(respuesta);

    });
    // PUT Actualiza carrera

    app.put("/sportsevent/:id", function(req, res) {

        console.log('updateing');
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
            url: req.body.durl,
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
        listCarreras.update_carrera(id,new SportsEvent(event.name,event.url,id,event.description,event.startDate,event.competitor, event.location));


        res.sendStatus(204);
    });






    // AÑADIR UNA CARRERA **********************(GET CON FORMULARIOS HTML)
    // GET Añadir una carrera
    app.get("/sportsevent", function(req, res) {
        let respuesta = swig.renderFile('views/eventform.html',{});

        res.send(respuesta);
    });
    app.get("/json", function(req, res) {

        let json =JSON.stringify(listCarreras.carreras);
        res.send(json);
    });
};


