import chai from "chai";
import storage from "../storage/mongodb.js"
import { FileStorage } from "../storage/FilesStorage.js";
import { assert } from "console";

describe("mongo storage requirements", function (){
    it("insert data into the database",async function () { 
       let result = await storage.addUser({"email": "test@email.com"})
       chai.assert.equal(result.acknowledged, true)
       
     }) 
    
     it("truncate all the table in database", async function() {
        let result = await storage.truncatCollection(true)
        chai.assert.hasAllKeys(result, ["acknowledged", "deletedCount"])
        result = await storage.truncatCollection()
        chai.assert.hasAllKeys(result, ['confirmation'])
        
     })

     describe("testing querying", function () {
        let email = "test@gmail.com"
        this.afterEach(async function () {
            await storage.truncatCollection(true)
            
        })

        this.beforeAll(async function () {
            await storage.addUser({"email" : email})
            
        })

        it("search for an existed user", async function() {
            let result = await storage.getUser({"email": email})
            chai.assert.equal(result.email, email)
            
        })

        it("non existed user", async function() {
            let result = await storage.getUser({"email": "xx"})
            chai.assert.typeOf(result, "null")
            
        })

    })

    describe("saving file operations", function () {
        let data = Buffer.from("data")
        let file = new FileStorage("/db/test",data.toString("base64"), "test.txt" )
        it("inserting file information into collection", async function() {
            let path = await file.saveFile()
            let dbsaved = await storage.addFile("profilPics", {"path": path})
            chai.assert.equal(dbsaved.acknowledged, true)
        })

        it("getting file from a database", async function () {
            let diskSave = await file.saveFile()
            //insert the file into the database
            await storage.addFile("test", {"path": diskSave.localPath})
            let test = await storage.getFile("test", {"path": diskSave.localPath})
            chai.assert.equal(diskSave.localPath,test.path)
            
        })
    })
})