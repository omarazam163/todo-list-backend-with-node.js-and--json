import fs from 'fs'
import http from "http";
import { todo } from 'node:test';

const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

const server= http.createServer((req, res) => {
    let {url,method}=req;
    if(url==="/todos"&&method==="GET"){
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(todos));
    }
    else if(url?.startsWith("/todos/")&&method==="GET"){
        let id:number = parseInt((url.split("/").pop())??"-1");
        let wanted_todo= todos.find((todo:any)=>todo.id===id);
        if(wanted_todo)
        {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(wanted_todo));
        }
        else
        {
            res.writeHead(404, {"Content-Type": "text/text"});
            res.end("no such id");
        }
    }
    else if(url==="/todos"&&method==="POST"){
        let body = "";
        req.on("data",(chunk)=>{
            body += chunk;});
        req.on("end",()=>
        {
            const new_todo = JSON.parse(body);
            todos.push(new_todo);
            new_todo.id = todos.length+1;
            new_todo.start_date = new Date();
            new_todo.done = false;
            new_todo.end_date = null;
            res.writeHead(200, {"Content-Type": "application/json"});         
            fs.writeFileSync("./todos.json", JSON.stringify(todos,null,2));
            res.end(JSON.stringify(todos));
        });
    }
    else if(url?.startsWith("/todos/update_title/")&&method==="PUT")
    {
        let id:any = url.split("/").pop();
        let wanted_todo = todos.find((todo:any)=>todo.id===parseInt(id));
        if(wanted_todo){
            let body:string="";
            req.on("data",(chunk)=>{
                body+=chunk;
            });
            req.on("end",()=>
            {
                let update = JSON.parse(body);
                wanted_todo.title = update.title;
                res.writeHead(200, {"Content-Type": "application/json"});         
                fs.writeFileSync("./todos.json", JSON.stringify(todos,null,2));
                res.end(JSON.stringify(todos));
            });
        }
        else
        {
            res.writeHead(404, {"Content-Type": "text/text"});
            res.end("no such id");
        }
    }
    else if(url?.startsWith("/todos/update_done/")&&method==="PUT")
    {
        let id:number = parseInt((url.split("/").pop())??"-1");
        let wanted_todo= todos.find((todo:any)=>todo.id===id);
        if(wanted_todo)
        {
            if(wanted_todo.done === true)
            {
                res.writeHead(200, {"Content-Type": "test/text"});
                res.end("task already marked as done");
            }
            else
            {
            wanted_todo.done = true;
            wanted_todo.end_date = new Date();
            fs.writeFileSync("./todos.json", JSON.stringify(todos,null,2));
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(todos));
            }
    }
    else
    {
        res.writeHead(404, {"Content-Type": "text/text"});
        res.end("no such id");
    }
}
else if(url?.startsWith("/todos/")&&method==="DELETE"){
    let id:number = parseInt((url.split("/").pop())??"-1");
    let index = todos.findIndex((todo:any)=>todo.id===id);
    if(index!==-1)
    {
        todos.splice(index,1);
        fs.writeFileSync("./todos.json", JSON.stringify(todos,null,2));
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(todos));
    }
    else{
        res.writeHead(404,{"Content-Type": "text/text"});
        res.end("no such id");
    }
}
    else{
        res.writeHead(404, {"Content-Type": "text/text"});
        res.end("route not found");
    }
});


server.listen(3000,()=>console.log("server started on port 3000"));