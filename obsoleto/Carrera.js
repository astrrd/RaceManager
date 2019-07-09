// IMPORTANTE: AHORA MISMO NO SE USA, SE EMPLEA SPORTSEVENT

// Clase Carrera


module.exports = class Carrera {
    constructor(id, name, url, description, startDate, location, competitor = []) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.description = description;
        this.startDate = startDate;
        this.location = location;
        this.competitor = competitor;
    }

    add_competitor(competitor){
        this.competitor.push(competitor);
    }
}
