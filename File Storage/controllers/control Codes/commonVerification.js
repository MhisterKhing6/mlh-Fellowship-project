import { ObjectId } from "mongodb"

/**
 * generateToken: Generate a unique token that can be use as id
 * @returns strings of unique id
 */
export function generateToken() {
    //get the authentication
    return new ObjectId().toString()
}

/**
 * manatoryFields: checks if request has all the required fileds need for the operation
 * @param {array} requiredFields : The fields that are required
 * @param {object} givenFilds : objects containing the filds to be checked
 * @returns {array}: indicating missing fields
 */
export function mandatoryFields(requiredFields, givenFilds) {
    let missing = [];
    for(const field of requiredFields) {
        if (!Object.keys(givenFilds).includes(field) || (givenFilds[field] === "")) {
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
 
