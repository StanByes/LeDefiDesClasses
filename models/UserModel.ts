import User from "../entities/User";
import { QueryCondition, BaseModel, InsertValues } from "./BaseModel";

export default class UserModel extends BaseModel {
    public baseName: string = "users";
    public structure: string[] = ["id", "first_name", "last_name", "password", "class_name", "points"];

    public async find(type: "all", conditions?: QueryCondition[]): Promise<User[]>;
    public async find(type: "first" | "last", conditions?: QueryCondition[]): Promise<User>;
    public async find<T extends "all" | "first" | "last">(type: T, conditions?: QueryCondition[]): Promise<User | User[] | undefined> {
        let queryResult: any[] = await super.get(type, conditions);

        let getResult: User[] | User | undefined = type == "all" ? [] : undefined;
        if (type == "all") {
            for (let result of queryResult) {
                getResult?.push(this.toObject(result));
            }
        } else {
            getResult = this.toObject(queryResult);
        }

        return getResult;
    }

    public async create(user: User): Promise<number> {
        let insertValues: InsertValues[] = [
            {
                key: "first_name",
                value: user.firstName
            },
            {
                key: "last_name",
                value: user.lastName
            },
            {
                key: "password",
                value: user.password
            },
            {
                key: "class_name",
                value: user.group.groupName
            },
            {
                key: "points",
                value: 0
            }
        ];

        let insertId = await super.insert(insertValues);
        user.setId(insertId);

        return insertId;
    }

    public toObject(data: any): any {
        let group = this.app.groups.get(data.class_name)!;
        group.registerStudent(data.points);

        return {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            password: data.password,
            group: group,
            points: data.points
        };
    }
}