import express  from "express";
import bodyParser from "body-parser";
import userRouter from "./views/user.js"
import authRouter from "./views/authentication.js";
import cors  from "cors"

//ports and ips
const port = process.env.PORT | 5555;

//setting up server
let server = express();
//adding middle wares
server.use(express.json())
server.use(cors())
server.use("/public", express.static("public"));
//adding routes
server.use(authRouter)
server.use(userRouter)


//Type Get
//Domain: public
server.get("/", (req, res) => {
    res.send("ok im hrere");
})

//Listen to the port
server.listen(port, ()=> {
 console.log(`im listening at http://localhost:${port}`)
})

async function close() {
    await server.close()
}

export default server