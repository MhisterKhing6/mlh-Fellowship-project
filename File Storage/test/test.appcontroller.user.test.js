import chai from "chai";
import  { mandatoryFields, getCookie, getUserIdfromCookie} from "../controllers/control Codes/commonVerification.js";
import redisCatch from "../storage/redis.js"
describe("user controller test", function () { 
    it("mandatory fileds", function (){
        let requiredFields = ["email", "password", "name"];
        let user = {"name": "Kofi Asare", "password": "Ama", "email":"kofi@gmail.com"}
        chai.assert.equal(mandatoryFields(requiredFields, user).length, 0);
        user.name = ""
        chai.assert.equal(mandatoryFields(requiredFields, user)[0], "name")
        user.password = ""
        chai.assert.equal(mandatoryFields(requiredFields, user
            ).length, 2);
    
    })
 })

 describe("verification codes", function () {

    it("checks if a cookie object is not given", function () {
        let req = { cookie: {}}
        let cookie = getCookie(req)
        chai.assert.isUndefined(cookie)
    })

    it("checks if a cookie object is in response", async function () {
        let req = { cookie: {'ses_id': "abb"}}
        let cookie = getCookie(req)
        chai.assert.isString(cookie)
        chai.assert.equal(cookie, "abb")
    })

    describe("getting user Id from cookie", function (){
        it("getting corresponding id in redis", async function() {
            let ses_id = "test2"
            let test_id = "test2id"
            before(async function () {
            await   redisCatch.setVariable(ses_id, id)
            })

            it("returns id from the session token from the ", async function() {
                let id = await getUserIdfromCookie(ses_id)
                chai.assert.equal(id, test_id)
            })
            /*after(async function() {
                redisCatch.
            }) */
        })
    })
 })