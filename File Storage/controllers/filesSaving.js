import { mandatoryFields } from "./control Codes/commonVerification.js";
import Storage from "../storage/mongodb.js"
import {FileStorage} from "../storage/FilesStorage.js"
import { generateToken } from "./control Codes/commonVerification.js";

/**
 * Handles Registered files operation
 * 
 */

export default class FilesOperation {
    /**
     * FilesOperation : handles saving and writing file operation from a request
     * @param {Oject} req -> request object containing file details for operation
     * @param {Ojbect} res  -> The response object
     * @returns {Object} res => sends response object with details of file writing status
     */

    static async addFile(req, res) {
        let fileDetails = req.body
        let requiredFields = ['token', 'data', "filePath", "fileName"]
        //check if all the require fields are giving
        let missingFields = mandatoryFields(requiredFields, fileDetails)
        if(missingFields) {
            res.status(400).json({"Message": "missing mandatory fields", "missing fields": missingFields, "required fields": requiredFields})
        } else {
            let user = Storage.getUser({"token": fileDetails.token})
            if(user) {
                //henle file operation
                //use user token to generate a specific folder for file saving
                let absolutePath = `${fileDetails.token}/${fileDetails.filePath}`
                let file = new FileStorage(absolutePath,fileDetails.data, fileDetails.fileName)
                try {
                        //save file to disk and generate url
                        let result = await file.saveFile()
                        if(result.completed) {
                            //handles save operation here
                            let url = "http://localhost:5555/" + result.localPath
                            let id = generateToken()
                            await Storage.addFile({id, "name": fileName, "path": result.localPath, url, "token": fileDetails.token})
                            res.status(200).json({file_id: id, "token": fileDetails.token, url})
                        } else {
                            res.status(400).json(result)
                        }
                } catch {
                    res.status(501).json({"message": "internal error contact admin"})
                }
            } else {
                res.status(401).json({"message": "invalid token", tip: "Get new token" })
            }
        }
    }
}