// Clase Carreras

class Carreras {
    constructor(carreras = []) {
        this._name ;
        this._carreras = carreras;
    }


    get carreras() {
        return this._carreras;
    }

    set carreras(value) {
        this._carreras = value;
    }


    get_carrera(id) {
        if (this._carreras.filter(d => d.id == id)) {
            return this._carreras.filter(d => d.id == id)[0];
        }
        else return null;
    }


    add_carrera(carrera) {
        this._carreras.push(carrera);
    }


    update_carrera(id, carrera)
    {
        console.log('updating')

        let car = this._carreras.filter(d => d.id == id)
        let i = this._carreras.indexOf(car[0]);

        this._carreras[i] = carrera;
        console.log(this._carreras)
    }


    delete_carrera(id){


        this._carreras = this._carreras.filter(x => x.id != id)

    }


    get_corredores() {
        let competitor  = [];

        for(c of this._carreras) {
            for(let i = 0; i < c.competitor.length; i++) {
                competitor.push(c.competitor[i]);
            }
        }

        return competitor;
    }


    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
}


module.exports = Carreras;


