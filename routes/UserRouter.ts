import express, { NextFunction, Request, Response, Router } from "express";
import App from "../app";
import UserController from "../controllers/UserController";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
    auth: string | JwtPayload;
}

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

        this.middlewares();
        this.initRoutes();
    }

    private middlewares() {
        this.router.use((req: Request, res: Response, next: NextFunction) => {
            if (req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1];
                const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

                console.log(decodedToken);

                (req as CustomRequest).auth = decodedToken;                                         
            }

            next();
        });
    }

    private initRoutes() {
        this.router.use("/sign", (req: Request, res: Response, next: NextFunction) => {
            this.controller.sign(req, res, next);
        });

        this.router.use("/login", (req: Request, res: Response, next: NextFunction) => {
            this.controller.login(req, res, next);
        });
    }
}