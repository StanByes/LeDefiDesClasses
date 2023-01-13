import Group from "./Group";

export default class User {
    public id!: number;
    public firstName: string;
    public lastName: string;
    public password: string;
    public group: Group;
    public points: number;

    constructor(firstName: string, lastName: string, password: string, group: Group, points: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.group = group;
        this.points = points;
    }

    public setId(id: number) {
        this.id = id;
    }
}