import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import App from "../app";
import User from "../entities/User";

export default class UserController {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    public async sign(req: Request, res: Response, next: NextFunction) {
        if (req.method.includes("POST")) {
            let { firstName, lastName, password, group } = req.body;
            if (!firstName || !lastName || !password || !group)
                return res.status(400).json({code: 400, message: "Bad request"});
            
            let existUser;
            for (let searchUser of this.app.users.values()) {
                if (searchUser.firstName == firstName && searchUser.lastName == lastName) {
                    existUser = true;
                    break;
                }
            }

            if (existUser)
                return res.status(409).json({code: 409, message: "User already exist"});

            let groupInstance = this.app.groups.get(group);
            if (!groupInstance)
                return res.status(400).json({code: 400, message: "Group not exist"});

            const hash = await bcrypt.hash(password, 10);
            const user = new User(firstName, lastName, hash, groupInstance, 0);

            await this.app.userModel.create(user);

            // Register Student
            user.group.registerStudent(0);
            this.app.users.set(user.id, user);

            req.session.user = user;
            return res.status(201).json({
                code: 201, 
                message: "Success"
            });
        }
        
        return res.status(405).json({code: 405, message: "Method not allowed"});
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        if (req.method.includes("POST")) {
            let { firstName, lastName, password } = req.body;
            if (!firstName || !lastName || !password)
                return res.status(400).json({code: 400, message: "Bad request"});
            
            let user;
            for (let searchUser of this.app.users.values()) {
                if (searchUser.firstName == firstName && searchUser.lastName == lastName) {
                    user = searchUser;
                    break;
                }
            }

            if (!user)
                return res.status(404).json({code: 404, message: "User not found"});

            const checkPass = await bcrypt.compare(password, user.password);
            if (!checkPass)
                return res.status(422).json({code: 422, message: "Incorrect password"});

            req.session.user = user;
            return res.status(200).json({
                code: 200, 
                message: "Success"
            });
        }

        return res.status(405).json({code: 405, message: "Method not allowed"});
    }

    public async logout(req: Request, res: Response, next: NextFunction) {
        if (req.session.user) {
            req.session.user = undefined;
            return res.status(200).json({code: 200, message: "Success"});
        } else {
            return res.status(401).json({code: 401, message: "Unauthorized"});
        }
    }
}