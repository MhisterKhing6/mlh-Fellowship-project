import { Router } from "express";
import AuthenticationController from "../controllers/authenticationController.js";

let authRoute  = Router()


authRoute.post("/login", AuthenticationController.login);
authRoute.get("/verification/status", AuthenticationController.verifacationStatus);


export default authRoute;