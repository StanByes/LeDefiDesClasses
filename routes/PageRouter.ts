import express, { NextFunction, Request, Response, Router } from "express";
import App from "../app";
import PageController from "../controllers/PageController";

export default class PageRouter {
    public app: App;
    public routeName: string;
    public router: Router;
    public controller: PageController;

    constructor(app: App) {
        this.app = app;
        this.routeName = "/";
        this.router = express.Router();
        this.controller = new PageController(app);

        this.initRoutes();
    }

    private initRoutes() {
        this.router.get("/", (req: Request, res: Response, next: NextFunction) => {
            this.controller.home(req, res, next);
        });
    }
}