import express, { Express, NextFunction, Request, Response } from "express";
import createError, { HttpError } from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import dotenv from "dotenv";
import { Connection, createConnection } from "promise-mysql";
import config from './utils/config.json';
import UserModel from "./models/UserModel";
import User from "./entities/User";
import Group from "./entities/Group";
import UserRouter from "./routes/UserRouter";
import PageRouter from "./routes/PageRouter";
import ChallengeModel from "./models/ChallengeModel";
import Challenge from "./entities/Challenge";
import ChallengeHistory from "./entities/ChallengeHistory";
import ChallengeHistoryModel from "./models/ChallengeHistoryModel";

export default class App {
    public express: Express;
    public database!: Connection;
    public userModel: UserModel = new UserModel(this);
    public challengeModel: ChallengeModel = new ChallengeModel(this);
    public challengeHistoryModel: ChallengeHistoryModel = new ChallengeHistoryModel(this);
    public prod: boolean;

    public groups: Map<string, Group> = new Map();
    public users: Map<number, User> = new Map();
    public challenges: Map<number, Challenge> = new Map();
    public challengesHistories: Map<number, ChallengeHistory> = new Map();

    constructor() {
        dotenv.config();

        this.express = express();
        this.initWebServer();

        createConnection({
            user: "defi",
            password: "1234",
            database: "defi_des_classes",
        }).then(c => {
            this.database = c;

            this.loadData();
        });

        this.prod = this.express.get("env") == "production";
    }

    private initWebServer() {
        this.express.use(logger('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(cookieParser());

        const sessionParams = {
            secret: process.env.SESSION_SECRET!,
            cookie: {
                secure: false
            },
            resave: false,
            saveUninitialized: false
        };

        if (this.prod) {
            sessionParams.cookie.secure = true;
            this.express.set("trust proxy", 1);
        }
        this.express.use(session(sessionParams));

        this.express.use(express.static("./public"));

        this.express.engine('html', require('ejs').renderFile);
        this.express.set('view engine', 'ejs');

        this.express.use('/robots.txt', (req: Request, res: Response, next: NextFunction) => {
            res.type('text/plain');
            res.send("User-agent: *\nDisallow: /");
        });

        this.express.use((req: Request, res: Response, next: NextFunction) => {
            req.data = {
                user: undefined,
                groups: Array.from(this.groups.values()),
                challenges: Array.from(this.challenges.values()),
                notCompleteChallenges: undefined
            }

            if (req.session.user) {
                req.data.user = req.session.user;

                let todayChallenges = this.getTodayChallenges();
                let userHistory = this.getUserHistory(req.session.user);

                let notCompleteChallenges: ChallengeHistory[] = [];
                for (let history of userHistory) {
                    let challenge = todayChallenges.find(c => c.id == history.challenge.id && c.chanceCount != history.chanceCount);
                    if (!challenge)
                        continue;

                    notCompleteChallenges.push(history);
                }

                req.data.notCompleteChallenges = notCompleteChallenges;
            }

            next();
        });

        // Routes
        let pageRouter = new PageRouter(this);
        let userRoute = new UserRouter(this);
        this.express.use(pageRouter.routeName, pageRouter.router);
        this.express.use(userRoute.routeName, userRoute.router);
        
        // catch 404
        this.express.use(function(req: Request, res: Response, next: NextFunction) {
          next(createError(404));
        });
        
        // error handler
        this.express.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
          console.log(`${req.method} ${req.originalUrl} [${err.statusCode}] ${err.message}`);
        });
        
        this.express.listen(3000, () => {
          console.log('API lancée avec succès !');
        })
    }

    private async loadData() {
        // Load groups
        for (let group of config.groups)
            this.groups.set(group, new Group(group));

        // Load Users
        let users: User[] = await this.userModel.find("all");
        if (users)
            users.forEach(u => this.users.set(u.id, u));

        // Load Challenges
        let challenges: Challenge[] = await this.challengeModel.find("all");
        if (challenges)
            challenges.forEach(c => this.challenges.set(c.id, c));

        // Load Challenges Histories
        let challengesHistories: ChallengeHistory[] = await this.challengeHistoryModel.find("all");
        if (challengesHistories)
        challengesHistories.forEach(c => this.challengesHistories.set(c.id, c));
    }

    private getTodayChallenges() {
        let result: Challenge[] = [];
        for (let challenge of this.challenges.values()) {
            let cDate = challenge.appearanceDate;
            let date = new Date();
            if (cDate.getDate() == date.getDate() && cDate.getMonth() == date.getMonth() && cDate.getFullYear() == date.getFullYear())
                result.push(challenge);
        }

        return result;
    }

    private getUserHistory(user: User) {
        let result: ChallengeHistory[] = [];
        for (let challengeHistory of this.challengesHistories.values())
            if (challengeHistory.user == user)
                result.push(challengeHistory);
        
        return result;
    }
}

new App();