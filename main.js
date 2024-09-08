"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var http = require("http");
var todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));
var server = http.createServer(function (req, res) {
    var url = req.url, method = req.method;
    if (url === "/todo" && method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(todos));
    }
    else {
        res.writeHead(404, { "Content-Type": "text/text" });
        res.end("route not found");
    }
});
server.listen(3000,()=>console.log("server started on port 3000"));