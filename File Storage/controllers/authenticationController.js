import { response } from "express"
import storage from "../storage/mongodb.js"
import RedisCatch from "../storage/redis.js"
import { mandatoryFields, getCookie, getUserIdfromCookie } from "./control Codes/commonVerification.js"
import { generateToken } from "./control Codes/commonVerification.js"
import sha1 from "sha1"
//Using token Authentication

export default class AuthenticationController {
    static async login(req, res) {
        let credentials = req.body //Get user credentials
         //check if all the required filds are given
        let requiredFields = ["email", "password"]
        let notGiven = mandatoryFields(requiredFields, credentials)
        if(notGiven.length != 0) {
            res.status(201).json({"message": "Fields Missing", "requiredFields": notGiven})
        } else {
            //get user from email
            try {
                let user = await storage.getUser({"email": credentials.email})
                //if user exist
                if(user) {
                    //check if passwords match
                    if(user.password === sha1(credentials.password)) {
                        ///generate a session token
                        let ses_id = generateToken()
                        //save the token with the user id in redis
                        try { 
                                await RedisCatch.setVariable(ses_id, user.id)
                                //save the session id as cookie in the response object
                                res.cookie("ses_id", ses_id)
                                //send the session id and the user object to the user
                                res.status(200).json({"ses_id": ses_id, user: user})
                        } catch(error) {
                            console.log(error)
                            res.status(501).json({"message": "internal error contact admin"})
                        }
                    } else {
                        res.status(401).json({"message": "password does not match"})
                    }
                } else {
                    res.status(401).json({"message": "user does not have account"})
                }
            } catch(error) {
                console.log(error)
                res.status(501).json({"message": "internal error"})
            }
        }

    }

    static async verifacationStatus(req, res) {
        /* verifictionSatatus : Checks if a user is authenticatated by using session
           @param [req]: request object to get cookie from
           @param [res]: response object
           @return : object indicating user status and user object
        */
       //get session from cookie
        let ses_id = getCookie(response)
        if(!ses_id) {
            res.status(401).json({"verified": false})
        } else {
            let User_id = await getUserIdfromCookie(ses_id)
            //Get user object from id
            let user = await storage.getUser({"id": User_id})
            let userDetails = {"ses_id": ses_id, "name": user.name, "email": user.email, "profilePic": user.profilePic}
            //return response
            res.status(200).json({"verified": true, "user": userDetails})
        }

    }
}