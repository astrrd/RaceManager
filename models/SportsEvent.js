// Clase SportsEvent, que hereda de Event

const Event = require('./Event');
const Competitor= require('../models/Competitor.js');
 class SportsEvent extends Event {
    constructor(id, name, url, description, startDate, location, competitor = []) {
        super(id, name, url, description, startDate, location);
        this._id = id;
        this._name = name;
        this._url = url;
        this._description = description;
        this._startDate = startDate;
        this._location = location;
        this._competitor = competitor;
    }

    get_carreraid(name)
    {
        var carr =this._competitor.filter(d => d._name === name);
        return carr.id;
    }
    add_competitor(c){
        this.competitor.push(c);
    }
    update_competitor(id, name){
        var carr =this._competitor.filter(d => d.id === id);
        var i = this._competitor.indexOf(carr[0]);
         let comp= new Competitor(id,name);
        this._competitor[i] = comp;



    }
    add_competitor(competitor){
        this._competitor.push(competitor);
    }


    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get url() {
        return this._url;
    }

    get description() {
        return this._description;
    }

    get startDate() {
        return this._startDate;
    }

    get location() {
        return this._location;
    }

    get competitor() {
        return this._competitor;
    }
}


module.exports = SportsEvent;