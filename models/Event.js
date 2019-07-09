// Clase Event

class Event {
    constructor(id, name, url, description, startDate, location) {
        this._id = id;
        this._name = name;
        this._url = url;
        this._description = description;
        this._startDate = startDate;
        this._location = location;
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
}


module.exports = Event;
