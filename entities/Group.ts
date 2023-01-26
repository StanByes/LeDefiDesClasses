export default class Group {
    public name: string;
    public totalPoint: number = 0;
    public studentCount: number = 0;

    constructor(name: string) {
        this.name = name;
    }

    public registerStudent(points: number) {
        this.totalPoint += points;
        this.studentCount += 1;
    }
}