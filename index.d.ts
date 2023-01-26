import { Request } from "express-serve-static-core";
import ChallengeHistory from "./entities/ChallengeHistory";
import Group from "./entities/Group";
import User from "./entities/User";

declare module "express-session" {
    interface SessionData {
        user: User
    }
}

declare module "express-serve-static-core" {
    interface Request {
        data: ResponseData;
    }
}

interface ResponseData {
    user: User | undefined
    groups: Group[]
    challenges: Challenge[]
    notCompleteChallenges: ChallengeHistory[] | undefined;
}

export {
    ResponseData
}