
"use strict";

import * as http from "http";
import * as fs from 'fs';
import * as mime from 'mime-types';
import { client } from './config/db';// Import the database client


let lookup = mime.lookup;
const port = process.env.PORT || 3000;

// Attempt to connect to the database when the server starts
client.connect()
    .then(() => {
        console.log("Connected to MongoDb at MongoDb Atlas");

        // Create the HTTP server only after connecting to the database
        const server = http.createServer((req, res) => {
            let path = req.url as string;

            if(path === "/" || path === "/home"){
                path = "/index.html";
            }
            let mime_type = lookup(path.substring(1)) as string;

            fs.readFile(__dirname + path, function (err,data ) {

                if(err){
                    res.writeHead(404);
                    res.end("Error 404 - File Not Found" + err.message);
                    return;
                }
                if(!mime_type){
                    mime_type = 'test/plain';
                }

                //set content security headers and response with the file
                res.setHeader("X-Content-Type-Options", "nosniff");
                res.writeHead(200, {'Content-Type': mime_type});
                res.end(data);
            });
        });

        server.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/`);
        });

    })
    .catch(err => {
        console.error("Could not connect to the database", err);
    });
