import Challenge from "../entities/Challenge";
import { QueryCondition, BaseModel } from "./BaseModel";

export default class ChallengeModel extends BaseModel {
    async create(insertValues: any): Promise<number> {
        // Ignored
        return -1;
    }

    public baseName: string = "challenges";
    public structure: string[] = ["id", "name", "description", "creation_date", "appearance_date", "points", "chance_count"];

    public async find(type: "all", conditions?: QueryCondition[]): Promise<Challenge[]>;
    public async find(type: "first" | "last", conditions?: QueryCondition[]): Promise<Challenge>;
    public async find<T extends "all" | "first" | "last">(type: T, conditions?: QueryCondition[]): Promise<Challenge | Challenge[] | undefined> {
        let queryResult: any[] = await super.get(type, conditions);

        let getResult: Challenge[] | Challenge | undefined = type == "all" ? [] : undefined;
        if (type == "all") {
            for (let result of queryResult) {
                getResult?.push(this.toObject(result));
            }
        } else {
            getResult = this.toObject(queryResult);
        }

        return getResult;
    }

    public toObject(data: any): any {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            creationDate: data.creation_date,
            appearanceDate: data.appearance_date,
            points: data.points,
            chanceCount: data.chance_count
        };
    }
}