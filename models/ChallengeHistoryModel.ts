import ChallengeHistory from "../entities/ChallengeHistory";
import { QueryCondition, BaseModel, InsertValues } from "./BaseModel";

export default class ChallengeHistoryModel extends BaseModel {
    public baseName: string = "users";
    public structure: string[] = ["id", "defi_id", "user_id", "complete_dates", "chance_count"];

    public async find(type: "all", conditions?: QueryCondition[]): Promise<ChallengeHistory[]>;
    public async find(type: "first" | "last", conditions?: QueryCondition[]): Promise<ChallengeHistory>;
    public async find<T extends "all" | "first" | "last">(type: T, conditions?: QueryCondition[]): Promise<ChallengeHistory | ChallengeHistory[] | undefined> {
        let queryResult: any[] = await super.get(type, conditions);

        let getResult: ChallengeHistory[] | ChallengeHistory | undefined = type == "all" ? [] : undefined;
        if (type == "all") {
            for (let result of queryResult) {
                getResult?.push(this.toObject(result));
            }
        } else {
            getResult = this.toObject(queryResult);
        }

        return getResult;
    }

    public async create(challengeHistory: ChallengeHistory): Promise<number> {
        let insertValues: InsertValues[] = [
            {
                key: "defi_id",
                value: challengeHistory.challenge.id
            },
            {
                key: "user_id",
                value: challengeHistory.user.id
            },
            {
                key: "complete_dates",
                value: challengeHistory.completeDates
            }
        ];

        let insertId = await super.insert(insertValues);
        challengeHistory.setId(insertId);

        return insertId;
    }

    public toObject(data: any): any {
        let challenge = this.app.challenges.get(data.defi_id)!;
        let user = this.app.users.get(data.user_id)!;

        return {
            id: data.id,
            challenge: challenge,
            user: user,
            completeDates: Array.from(data.complete_dates),
            chanceCount: data.chance_count
        };
    }
}