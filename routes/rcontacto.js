module.exports = function(app, swig) {
    app.get("/contacto", function(req, res) {
         let respuesta = swig.renderFile('views/contact.html', {
        });
        res.send(respuesta);
    });
    app.post("/contacto", function(req, res) {
        let correo = req.body.correo;
        let asunto = req.body.asunto;
        let contenido = req.body.contenido;

        res.redirect("mailto:diego@cotera.es?subject="+ asunto+"&body="+contenido+"&cc="+correo);
    });

    app.get('/json',  function(req, res) {
        console.log('!!!!json')
        var json = require('static/json/carreras.json');
        res.send(JSON.stringify(json));

    });

}