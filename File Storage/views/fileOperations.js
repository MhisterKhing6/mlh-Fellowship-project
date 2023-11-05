import { Router } from "express";
import FilesOperationController from "../controllers/fileController.js";

let fileOperationsRouter = Router()

/**
 * method:post
 * protected: yes
 * url: uploadfile
 * function: save user uploads
 */
fileOperationsRouter.post("/upload", FilesOperationController.addFile)







export default fileOperationsRouter