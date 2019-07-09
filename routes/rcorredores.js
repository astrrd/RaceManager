module.exports = function(app, swig,listCarreras) {
//GET todos los competidores
    const Carrerafile = require('../models/SportsEvent.js');
    const Carrera = Carrerafile.Carrera;
    const Competidorfile = require('../models/Competitor.js');
    const Competitor = Competidorfile.constructor;


    app.get("/competitors", function(req, res) {
        carreras = listCarreras.carreras;
        if(carreras.length ===0)
        {
            res.redirect('/subirFichero?mensaje=Suba un fichero&tipoMensaje=alert-danger')
        }
        else
        {
            let corredores = listCarreras.get_corredores();
            var respuesta = swig.renderFile('views/listcompetidor.html', {

                datos:corredores
            });
            res.send(respuesta);
        }
    });
    //GET formulario para añadir competidor
    app.get("/competitors/:id", function(req, res) {
        var respuesta = swig.renderFile('views/competitorForm.html', {
            id : req.params.id,
            url: "/competitors/",
            action: "Añadir"
        });
        res.send(respuesta);

    });
    //POST añade competitor
    app.post("/competitors/:id", function(req, res) {

        let id = req.params.id;
        var carrera = listCarreras.get_carrera(id);
        carrera.add_competitor(new Competitor(req.body.name));
        res.redirect('/competitors');

    });
    //GEt formulario de actualizar competitor
    app.get("/competitor/:id/:idc", function(req, res) {

        var respuesta = swig.renderFile('views/competitorForm.html', {
            id : req.params.id,
            idc: req.params.idc,
            url: "/u/",
            action: "Actualiza",
        });
        res.send(respuesta);

    });
    //POST actuliza competitor
    app.post("/u/:id/:idc", function(req, res) {
        console.log("actuliza");
        let id = req.params.id;
        let carrera = listCarreras.get_carrera(id);

        let name = req.body.name
        let idc = req.params.idc;
        carrera.update_competitor(idc,name);
         res.redirect('/competitors');

    });
}