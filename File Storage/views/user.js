import { Router } from "express";
import UserController from "../controllers/userController.js";
import bodyParser from "body-parser";

let userRouter = Router()

userRouter.post("/addUser",UserController.addUser);




export default userRouter;



