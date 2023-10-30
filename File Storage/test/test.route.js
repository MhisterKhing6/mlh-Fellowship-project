import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";
import storage from "../storage/mongodb.js"
import sha1 from "sha1"
import { resolveSoa } from "dns";



chai.use(chaiHttp);

  describe('/post login', () => {
      let name = "kofi Asare"
      let email = "test2@gmail.com"
      let password = "testtesttess"
      let id = "test.id";
      let encryptedPass = sha1(password)

      before(async function() {
        await storage.addUser({name, id,  email, "password": encryptedPass})
      })
      it('checks if all the required fields are not given',async () => {
        let response = await chai.request(server).post('/login').type("json").send({ 
        })
        chai.assert.equal(response.status, 201)
        chai.assert.isObject(response.body)
        chai.assert.equal(response.body.message, "Fields Missing")
        chai.assert.equal(response.body.requiredFields.length, 2)
      });

      it("check if all the required fileds are given but empty", async () => {
        let response = await chai.request(server).post('/login').type("json").send({ 
            "email": "", "password": ""
        })
        chai.assert.equal(response.status, 201)
        chai.assert.isObject(response.body)
        chai.assert.equal(response.body.message, "Fields Missing")
        chai.assert.equal(response.body.requiredFields.length, 2)
      })

      it("check if some of the required fileds are given", async () => {
        let response = await chai.request(server).post('/login').type("json").send({ 
            "password": "9832"
        })
        chai.assert.equal(response.status, 201)
        chai.assert.isObject(response.body)
        chai.assert.equal(response.body.message, "Fields Missing")
        chai.assert.equal(response.body.requiredFields.length, 1)
      })

      it("checks if the user has not registered", async () => {
        let response = await chai.request(server).post('/login').type("json").send({ 
            "email": "test@gmail.com", "password": "test"
        })
        chai.assert.equal(response.status, 401)
        chai.assert.isObject(response.body)
        chai.assert.equal(response.body.message, "user does not have account")
        
      })

      it("checks for wrong password", async () => {
        let response = await chai.request(server).post('/login').type("json").send({ 
            "email": email, "password": "test"
        })
        chai.assert.equal(response.status, 401)
        chai.assert.isObject(response.body)
        chai.assert.equal(response.body.message, "password does not match")
        
      })

      it("login success", async () => {
        let response = await chai.request(server).post('/login').type("json").send({ 
            "email": email, "password": password
        })
        chai.assert.equal(response.status, 200)
        chai.assert.isObject(response.body)
        
      })

      after(async function() {
        await storage.truncatCollection(true)
      })
  });

  describe("/post addUser ", function () {
    let name = "kofi Asare"
    let email = "test2@gmail.com"
    let email_test = "test3@gmail.com"
    let password = "testtesttess"
    let id = "test.id";
    let encryptedPass = sha1(password)

    before(async function() {
      await storage.addUser({name, id,  email, "password": encryptedPass})
    })
      it("checks if all fields are not giiven", async function () { 
        let response = await chai.request(server).post('/adduser').type("json").send({})
        chai.assert.equal(response.status, 400)
        chai.assert.equal(response.body.message, "Mandatory fields missing")
        chai.assert.equal(response.body.missingFields.length, 3)
       })

       it("checks if some of the fields are given", async function () { 
        let response = await chai.request(server).post('/adduser').type("json").send({
          password
        })
        chai.assert.equal(response.status, 400)
        chai.assert.equal(response.body.message, "Mandatory fields missing")
        chai.assert.equal(response.body.missingFields.length, 2)

       })

       it("checks if user registration success", async function () { 
        let response = await chai.request(server).post('/adduser').type("json").send({
          password, name, "email": email_test
        })
        chai.assert.equal(response.status, 200)
        chai.assert.equal(response.body.status, "created")
       })

       it("checks if user already exist", async function () { 
        let response = await chai.request(server).post('/adduser').type("json").send({
          password, name, "email": email
        })
        chai.assert.equal(response.status, 201)
        chai.assert.equal(response.body.message, "user already exist")
       })
       

       after(async function() {
          await storage.truncatCollection(true)
       })
    })

    describe("/get/verifcaton/status checks if a user is authenticated", function () {
       let agent = chai.request.agent(server)
       let name = "kofi Asare"
       let email = "test2@gmail.com"
       let password = "testtesttess"
       let id = "test.id";
       let encryptedPass = sha1(password)

    before(async function() {
      await storage.addUser({name, id,  email, "password": encryptedPass})
    })

       it("check if the user is authenticated", async function() {
        let response = await agent.post("/login").type("json").send({email, password})
        chai.assert.equal(response.status, 200)
        chai.expect(response).to.have.cookie("ses_id");
        let set_cookie = response.headers['set-cookie'].pop()
        let cookie = (set_cookie.split(";")[0]).split("=").pop()
        
        //let authenticatated = (await agent.get("/verification/status")).set()  
       })
       
       after(async function () {
        await storage.truncatCollection(true)
       })
    })

