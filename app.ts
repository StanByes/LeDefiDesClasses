import express, { Express, NextFunction, Request, Response } from "express";
import createError, { HttpError } from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { Connection, createConnection } from "promise-mysql";
import config from './utils/config.json';
import UserModel from "./models/UserModel";
import User from "./entities/User";
import Group from "./entities/Group";
import UserRouter from "./routes/UserRouter";

export default class App {
    public express: Express;
    public database!: Connection;
    public userModel: UserModel = new UserModel(this);

    public groups: Map<String, Group> = new Map();
    public users: Map<number, User> = new Map();

    constructor() {
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
    }

    private initWebServer() {
        this.express.use(logger('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(cookieParser());

        this.express.engine('html', require('ejs').renderFile);
        this.express.set('view engine', 'html');

        // Routes
        let userRoute = new UserRouter(this);
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
        for (let group of config.groups) {
            this.groups.set(group, new Group(group));
        }

        let users: User[] = await this.userModel.find("all");
        if (!users)
            return;

        users.forEach(u => this.users.set(u.id, u));
    }
}

new App();