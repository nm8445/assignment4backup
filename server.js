"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const fs = __importStar(require("fs"));
const mime = __importStar(require("mime-types"));
const db_1 = require("./config/db");
let lookup = mime.lookup;
const port = process.env.PORT || 3000;
db_1.client.connect()
    .then(() => {
    console.log("Connected to MongoDb at MongoDb Atlas");
    const server = http.createServer((req, res) => {
        let path = req.url;
        if (path === "/" || path === "/home") {
            path = "/index.html";
        }
        let mime_type = lookup(path.substring(1));
        fs.readFile(__dirname + path, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end("Error 404 - File Not Found" + err.message);
                return;
            }
            if (!mime_type) {
                mime_type = 'test/plain';
            }
            res.setHeader("X-Content-Type-Options", "nosniff");
            res.writeHead(200, { 'Content-Type': mime_type });
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
//# sourceMappingURL=server.js.map