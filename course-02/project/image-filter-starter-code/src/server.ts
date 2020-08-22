import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import * as bcrypt from 'bcrypt';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 9090;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  var validate_url = require("url");

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get("/filteredimage", async (req,res)=>{

    if(!req.params){
      return res.status(401).send({ message: 'No request params.' });
    }


    let url = req.query.image_url;
    let plainTextPassword = req.query.auth;
    generatePassword (plainTextPassword)
    await filterImageFromURL(url).then(filteredpath => {
      res.status(200).sendFile(filteredpath, () => {deleteLocalFiles([filteredpath]);} );
    })

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

  });
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();