import express, { NextFunction, Request, Response, Router } from "express";
import App from "../app";
import UserController from "../controllers/UserController";

export default class UserRouter {
    public app: App;
    public routeName: string;
    public router: Router;
    public controller: UserController;

    constructor(app: App) {
        this.app = app;
        this.routeName = "/user";
        this.router = express.Router();
        this.controller = new UserController(app);

        this.initRoutes();
    }

    private initRoutes() {
        this.router.use("/sign", (req: Request, res: Response, next: NextFunction) => {
            this.controller.sign(req, res, next);
        });

        this.router.use("/login", (req: Request, res: Response, next: NextFunction) => {
            this.controller.login(req, res, next);
        });

        this.router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
            this.controller.logout(req, res, next);
        })
    }
}