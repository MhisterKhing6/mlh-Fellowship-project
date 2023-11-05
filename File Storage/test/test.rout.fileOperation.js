import chai from "chai";
import FilesOperation from "../controllers/fileController.js";
import UserStorage from "../storage/mongodb.js"
import chaiHttp from "chai-http";
import server from "../server.js";
import sha1 from "sha1"
import { existsSync } from "fs";
chai.use(chaiHttp)

describe("Saving File operations", function (param){
    let email =  "test.email";
    let token = "test-token";
    let pwd = "test-pwd";
    let filePath = "test/filePath";
    let fileName = "test.txt";
    let data = Buffer.from("kofi").toString("base64url")
    let name = "test kofi"
    let encryptedPass = sha1(pwd)
    let fileObject = {email, token:"kofi"}
    before( async function() {
        let test_user = {email, token ,name , password:encryptedPass }
        await UserStorage.addUser(test_user)
    })

    after(async function() {
        UserStorage.truncatCollection(true)
    })
    it("should return mandatory fileds missing json response", async function() {
        let response = await chai.request(server).post("/upload").type("json").send(fileObject)
        chai.assert.isObject(response.body)
        chai.assert.equal(response.status, 400)
        chai.assert.equal(response.body.missingFields.length, 3)
    })

    it("should return token not valid respons", async function (){
        fileObject = {...fileObject, filePath, fileName, data}
        let response = await chai.request(server).post("/upload").type("json").send(fileObject)
        chai.assert.equal(response.status, 401)
        chai.assert.isDefined(response.body.tip)
        chai.assert.isString(response.body.tip)
        chai.assert.equal(response.body.message, "invalid token")
    })

    it("should return valid response with url", async function () {
        let valid_object = {data, fileName, filePath, token}
        let response = await chai.request(server).post("/upload").type("json").send(valid_object)
        chai.assert.equal(response.status, 200)
        chai.assert.isDefined(response.body.url)


    })
})