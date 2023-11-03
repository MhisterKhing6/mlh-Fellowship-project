import { ObjectId } from "mongodb"

export function generateToken() {
    //get the authentication
    return new ObjectId().toString()
}


export function mandatoryFields(requiredFields, givenFilds) {
    let missing = [];
    for(const field of requiredFields) {
        if (!Object.keys(givenFilds).includes(field) || (user[givenFilds] === "")) {
            missing.push(field)
        }
    }
    return missing
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
 
