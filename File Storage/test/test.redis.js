import { assert } from "console";
import redis from "../storage/redis.js";
import chai from "chai";

describe("redis catching operations" , function(){
    it("saving a variable",async function () {
        let test1 = await redis.setVariable("test1", "working")
        chai.assert.notTypeOf(test1, "null")
        chai.assert.equal(test1, "OK")
    })

    it("saving a variable with expiry time",async function (){
        let test2 = await redis.setVariable("test2", "working2", 10000)
        chai.assert.notTypeOf(test2, "null")
        chai.assert.equal(test2, "OK")
    })

    describe("Getting a key variable", function() {
        let testCasekey = "test3";
        let testCaseValue = "working3"
        this.beforeEach( async function () {
            await redis.setVariable(testCasekey, testCaseValue, 1000)
        })

        it("getting a value", async function() {
            let test3 = await redis.getVariable(testCasekey);
            chai.assert.notTypeOf(test3, "null")
            chai.assert.equal(test3, testCaseValue)
        })

        it("expiry case", async function() {
            await setTimeout( async ()=>{
                let test3 = await redis.getVariable(testCasekey);
                chai.assert.typeOf(test3, "null")
            }, 1002)
        })
    })
})