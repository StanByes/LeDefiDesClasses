import { NextFunction, Request, Response } from "express";
import App from "../app";

export default class PageController {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    public async home(req: Request, res: Response, next: NextFunction) {
        return res.render("index", req.data);
    }
}