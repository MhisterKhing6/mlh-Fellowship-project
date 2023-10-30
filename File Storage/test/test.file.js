import {assert} from "chai";
import { FileStorage } from "../storage/FilesStorage.js";
import { existsSync } from "fs";

/* Test for file storage on a disk
    File Data shoulb in base64 encodigin
*/

describe("Saving file locally", function () {
    let file = null;
    let data = Buffer.from("ok i was love you here").toString("base64url")
    console.log(data)
    before( function () {
        file = new FileStorage("/test/", data, "test.txt")
    })

    it("check if the file is saved in the directory",async function () {
            let result = await file.saveFile()
            assert.isTrue(result.completed, true)
            assert.isTrue(existsSync(result.path))  
    })


})