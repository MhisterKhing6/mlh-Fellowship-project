import { readFile, writeFile, existsSync, read} from "fs";
import { mkdir } from "fs";
import { ObjectId } from "mongodb";
import path from "path";
import { promisify } from "util";
import Jimp from "jimp";
const readFileAsync = promisify(readFile);
const writfileAsync = promisify(writeFile);




/* Class to handle saving file storage */
export class FileStorage {
    /* @class {Filestorage} : handles file operation to disk 
        @param {FilePath}   : The folder for the file to be saved
        @param {data}       : The content for the file to be saved must be base64 encoded test
        @param {originalFileName} : Specifiy the original file name of the file, helps in getting the file extension 
        @param {type}       : specify type of the file
     */
    constructor(FilePath, data, originalFileName) {
        this.fileFolder = path.join("./public/" + FilePath)
        this.data = data
        this.originalFileName = originalFileName
    }

    async saveFile() {
        /* Save file object in the database and local disk 
         @ return : localpath if success and null if error occured 
         */
        try {    //create Folder
                await mkdir(this.fileFolder, {recursive: true}, ()=>{})
                //generate file name
                //Get extension from the filename
                let extension = this.originalFileName.split(".").pop()
                if (extension) {
                //Generate a local name
                let filenName = new ObjectId().toString() + "." + extension
                this.localPath = path.join(this.fileFolder, filenName)
                //writing the file
                //generate the binary data from the file
                let dataStream = Buffer.from(this.data, "base64url")
                //write the file to the correct data
                await writfileAsync(this.localPath, dataStream)
                return {completed:true, "path": this.localPath };
                } else {
                    return {completed: false, message: "cant determine the type of file", tip: "ensure the fileName field include extension, example file.txt and not file"}
                }

        }catch(err){
            return  new Error(err.toString)
        }
    }

}