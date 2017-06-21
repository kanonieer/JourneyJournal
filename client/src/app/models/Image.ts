export class Image{
    _id:        String;
    file:       String;
    date:       String;
    longitude:  String;
    latitude:   String;
    id_journey: String;
    tags:       Array<String>;

    constructor() {
        this._id = "";
        this.file = "";
        this.date = "";
        this.longitude = "";
        this.latitude = "";
        this.id_journey = "";
        this.tags = [];
    }
}
