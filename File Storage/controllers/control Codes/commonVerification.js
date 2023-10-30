import { ObjectId } from "mongodb"
import Catch from  "../../storage/redis.js"

export function generateToken() {
    //get the authentication
    return new ObjectId().toString()
}


export function mandatoryUserFields(requiredFields, user) {
    let notGiven = [];
    for(const field of requiredFields) {
        if (!Object.keys(user).includes(field) || (user[field] === "")) {
            notGiven.push(field)
        }
    }
    return notGiven
}

export function getCookie(req) {
    /* 
    getCookie: returns session id cookie from a request object
    @param {req}: a request that has the user cookie set
    @return: cookie if set else null_otherwise
    */
    return req.cookie.ses_id;
 }

export async function getUserIdfromCookie(ses_id) {
    /* 
    getUserFromCookie : returns a user from cookie
    @param {ses_id} : session id to get cookie from
    @return :  user_id if set
    */
    return await caches.getCookie(ses_id)
}
 
