import { mandatoryFields } from "./control Codes/commonVerification.js";
import Storage from "../storage/mongodb.js"
import {FileStorage} from "../storage/FilesStorage.js"
import { generateToken } from "./control Codes/commonVerification.js";
/**
 * Handles Registered files operation
 * 
 */

export default class FilesOperationController {
    /**
     * FilesOperation : handles saving and writing file operation from a request
     * @param {Oject} req -> request object containing file details for operation
     * @param {Ojbect} res  -> The response object
     * @returns {Object} res => sends response object with details of file writing status and 
     *                          url of the file
     */

    static async addFile(req, res) {
        let fileDetails = req.body
        let requiredFields = ['token', 'data', "filePath", "fileName"]
        //check if all the require fields are giving
        let missingFields = mandatoryFields(requiredFields, fileDetails)
        if(missingFields.length !== 0) {
            res.status(400).json({"Message": "missing mandatory fields", "missingFields": missingFields, "required fields": requiredFields})
        } else {
            let user = await Storage.getUser({"token": fileDetails.token})
            if(user) {
                //use user token to generate a specific folder for file saving
                let absolutePath = `${fileDetails.token}/${fileDetails.filePath}`
                let file = new FileStorage(absolutePath,fileDetails.data, fileDetails.fileName)
                try {
                        //save file to disk and generate url
                        let result = await file.saveFile()
                        if(result.completed) {
                            //handles save operation here
                            let url = "http://localhost:5555/" + result.path
                            let id = generateToken()
                            await Storage.addFile("Files", {id, "name": fileDetails.fileName, "path": result.localPath, url, "token": fileDetails.token})
                            res.status(200).json({file_id: id, "token": fileDetails.token, url})
                        } else {
                            res.status(400).json(result)
                        }
                } catch(err) {
                    res.status(501).json({"message": "internal error contact admin"})
                }
            } else {
                res.status(401).json({"message": "invalid token", tip: "Get new token" })
            }
        }
    }
}