import storage from "../storage/mongodb.js"
import { ObjectId } from "mongodb";
import sha1 from "sha1";
import { mandatoryUserFields } from "./control Codes/commonVerification.js";
import { FileStorage } from "../storage/FilesStorage.js";

/* Handles user controller actions */

export default class UserController{

    static async addUser(req, res) {
        /*
         handles adding user from the front end 
            route-type: public
            http-methode: post
            @param {req} : user http request
            @param (res):  server htpp respons
        */ 
        let user = await req.body;
        let notGiven = mandatoryUserFields(["email", "password", "name"], user);
        if (notGiven.length === 0) {
            //save user information in the database
            try {
            //check if user has already registered
            let existed = await storage.getUser({"email" : user.email});
            if(existed) {
                res.status(201).json({"message": "user already exist"})
            } else {
                //check to see if the user gave the profile pic during reg
                let profile_Pic_Save_Status = {}
                if(user.profilePic && user.fileName) {
                    //save the file disk
                    let filePath = await (new FileStorage("/Profile_Pics", user.profilePic, user.fileName)).saveFile()
                    if(filePath.completed) {
                        //Generate url
                    user.profilePic = "http://localhost:5555/" + filePath.path;
                    profile_Pic_Save_Status.status = "completed"
                    profile_Pic_Save_Status.url = user.profilePic
                    } else {
                        profile_Pic_Save_Status.status = "aborted";
                        profile_Pic_Save_Status.reason = filePath.message
                    }
                    
                }
                //Add unique id
                user.id = new ObjectId().toString()
                user.password = sha1(user.password)
                await storage.addUser(user);
                res.status(200).json({"status": "created", "id":user.id, profile_Pic_Save_Status: profile_Pic_Save_Status.status ? profile_Pic_Save_Status : "Not Given" });
            }
            } catch(error) {
                res.status(501).json({"message": "internal error contact admin"})
            }
        }
        else {
            res.status(400).json({"status": "Not Created", "message": "Mandatory fields missing", "missingFields": notGiven})
        }
    }
} 

