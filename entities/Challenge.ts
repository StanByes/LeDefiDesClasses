export default class Challenge {
    public id: number;
    public name: string;
    public description: string;
    public creationDate: Date;
    public appearanceDate: Date;
    public points: number;
    public chanceCount: number;

    constructor(id: number, name: string, description: string, creationDate: Date, appearanceDate: Date, points: number, chanceCount: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.creationDate = creationDate;
        this.appearanceDate = appearanceDate;
        this.points = points;
        this.chanceCount = chanceCount;
    }
}