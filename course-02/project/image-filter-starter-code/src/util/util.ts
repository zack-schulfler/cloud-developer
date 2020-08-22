import fs from 'fs';
import Jimp = require('jimp');
import * as bcrypt from 'bcrypt';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
        await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname+outpath, (img)=>{
            resolve(__dirname+outpath);
        });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }

 async function generatePassword(plainTextPassword: string): Promise<string> {
        //@TODO Use Bcrypt to Generated Salted Hashed Passwords
        const Round = 10;
        const salt = await bcrypt.genSalt(Round);
        const hash = await bcrypt.hash(plainTextPassword,salt);
        return hash;
    }
    
async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
        //@TODO Use Bcrypt to Compare your password to your Salted Hashed Password
        return await bcrypt.compare(plainTextPassword,hash)
    }
}