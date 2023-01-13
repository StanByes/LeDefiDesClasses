export default class Group {
    public groupName: string;
    public totalPoint: number;
    public studentCount: number;

    constructor(groupName: string) {
        this.groupName = groupName;
        this.totalPoint = 0;
        this.studentCount = 0;
    }

    public registerStudent(points: number) {
        this.totalPoint += points;
        this.studentCount += 1;
    }
}