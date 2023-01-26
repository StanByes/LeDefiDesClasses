import Challenge from "./Challenge";
import User from "./User";

export default class ChallengeHistory {
    public id!: number;
    public challenge: Challenge;
    public user: User;
    public completeDates: Date[];
    public chanceCount: number;

    constructor(challenge: Challenge, user: User, completeDates: Date[], chanceCount: number) {
        this.challenge = challenge;
        this.user = user;
        this.completeDates = completeDates;
        this.chanceCount = chanceCount;
    }

    public setId(id: number) {
        this.id = id;
    }
}