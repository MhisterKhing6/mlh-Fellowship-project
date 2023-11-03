import { MongoClient } from "mongodb";
/* Storage class for users and files */
class Storage {
    isAlive = false;
    constructor(uri) {
        this.database = new MongoClient(uri);
        this.database.on("connect",()=> {
            this.isAlive = true;
        })
        this.database = this.database.db()
    }

    addUser = async (user) => this.database.collection("Users").insertOne(user)
    
    getUser = async (query) => this.database.collection("Users").findOne(query);
    

    getStatus = async ()=> {
        return this.isAlive ? true : false;
    }
    
    addFile = async (fileDetails) => this.database.collection("Files").insertOne(fileDetails)
    truncatCollection = async (confirmation = false) => confirmation ? this.database.collection("Users").deleteMany() : {"confirmation": "false"}
    //File Operations
    addFile = async(collection, file) => this.database.collection(collection).insertOne(file)
    getFile = async (collection, fileQuery) => this.database.collection(collection).findOne(fileQuery)
}



export default new Storage("mongodb://127.0.0.1:27017/FileManagement");