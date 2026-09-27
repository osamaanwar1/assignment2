const fs = require('fs');
const path = require('path');
const {EventEmitter}= require('events');
function showpath(){
    console.log({
        file: __filename,
        dir: __dirname
    })
}
showpath();
// Write a function that takes a file path and returns its file name.
function filename(){
    console.log(path.basename(__filename));
}
// filename();
//  Write a function that builds a path from an object (0.5 Grade)
function buildPath(obj) {
    return path.join(obj.dir, obj.name + obj.ext);
}

let result = buildPath({
    dir: "/folder",
    name: "app",
    ext: ".js"
});
//Write a function that returns the file extension from a given file path.
function file_extension(){
    console.log(path.extname(__filename));
}file_extension()
//Write a function that parses a given path and returns its name and ext.(0.5 Grade)
function parse(filename){
    const parser= path.parse(filename);
    console.log( {
        name:parser.name,
            ext:parser.ext
    })
}parse(__filename)
//Write a function that checks whether a given path is absolute.(0.5 Grade)
function absolute(filename){
    console.log(path.isAbsolute(filename))
}
// Write a function that joins multiple segments (0.5 Grade)
function join(){
    console.log(path.join('osama','app','app','index.html'));
}
join()
//Write a function that resolves a relative path to an absolute one.(0.5 Grade)
function resolve (x){
    console.log(path.resolve(x))
}resolve('assigment.js')
// Write a function that joins two paths.(0.5 Grade)
function join(){
    console.log(path.join('/folder1', 'folder2/file.txt'));
}
join()
//Write a function that deletes a file asynchronously.(0.5 Grade)
function deletes(){

fs.unlink('./os.txt', (err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log('File deleted successfully');
})}
//11. Write a function that creates a folder synchronously.(0.5 Grade)
function createfolder(){

   fs.mkdirSync('./osama');
        console.log('dir created successfully');
    }
// 12. Create an event emitter that listens for a "start" event and logs a welcome message.(0.5 Grade)
let events= new EventEmitter();
events.on('start', ()=>{console.log("hello world !");});
events.emit('start');
//13. Emit a custom "login" event with a username parameter.(0.5 Grade)
events.on('login', (username)=>{console.log(`hello world !${username}`);});
events.emit('login',"osama");
//14. Read a file synchronously and log its contents.(0.5 Grade)
let reading=fs.readFileSync("./osama.txt","utf8");
console.log(reading);
// Write asynchronously to a file.(0.5 Grade)
let readingasync=fs.readFile("./osama.txt",{encoding:"utf8"},(err, data)=>{console.log(data)});
//16. Check if a directory exists. (0.5 Grade)

function checkDirectory(dir) {
    return fs.existsSync(dir);
}
console.log(checkDirectory('./test'));
//Write a function that returns the OS platform and CPU architecture. (0.5 Grade)
const os = require('node:os');

function getSystemInfo() {
    return {
        platform: os.platform(),
        architecture: os.arch()
    };
}

console.log(getSystemInfo());
//18. Use a readable stream to read a file in chunks and log each chunk. (0.5 Grade)
let stream = fs.createReadStream("./osama.txt","utf8");

stream.on('data', (data)=>{console.log(data+' iam streamreader')});
//19. Use readable and writable streams to copy content from one file to another. (0.5 Grade)
let writable = fs.createWriteStream("./writable.txt","utf8");
stream.pipe(writable)
//20. Create a pipeline that reads a file, compresses it, and writes it to another file. (0.5 Grade)
const zlib = require('node:zlib');
const { pipeline } = require('node:stream');

pipeline(
    fs.createReadStream('./osama.txt'),
    zlib.createGzip(),
    fs.createWriteStream('./writable.txt.gz'),
    (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('File compressed successfully');
    }
);
//Part2: Simple CRUD Operations Using HTTP (5 Grades)

const http = require("http");

const USERS_FILE = "./os.json"; // one consistent file used everywhere

const server = http.createServer((req, res) => {

    // ---------------- POST /user ----------------
    if (req.method === "POST" && req.url === "/user") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            const newUser = JSON.parse(body);

            const users = JSON.parse(
                fs.readFileSync(USERS_FILE, "utf8")
            );

            const emailExists = users.some(
                user => user.email === newUser.email
            );

            if (emailExists) {
                res.writeHead(409, {
                    "Content-Type": "application/json"
                });

                return res.end(JSON.stringify({
                    message: "Email already exists"
                }));
            }

            users.push(newUser);

            fs.writeFileSync(
                USERS_FILE,
                JSON.stringify(users, null, 2)
            );

            res.writeHead(201, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "User created successfully",
                user: newUser
            }));
        });

        return;
    }

    if (req.method === "PATCH" && req.url.startsWith("/user/")) {

        const id = Number(req.url.split("/")[2]);

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            const updatedUser = JSON.parse(body);

            const users = JSON.parse(
                fs.readFileSync(USERS_FILE, "utf8")
            );

            const userIndex = users.findIndex(
                user => user.id === id
            );

            if (userIndex === -1) {
                res.writeHead(404, {
                    "Content-Type": "application/json"
                });

                return res.end(JSON.stringify({
                    message: "User not found"
                }));
            }

            Object.assign(users[userIndex], updatedUser);

            fs.writeFileSync(
                USERS_FILE,
                JSON.stringify(users, null, 2)
            );

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "User updated successfully",
                user: users[userIndex]
            }));
        });

        return;
    }

    // ---------------- DELETE /user/:id ----------------
    // 3) Create an API that deletes a User by ID. The user id should be retrieved from the URL (1 Grade)
    // MOVED ABOVE the catch-all 404 below -- it must run BEFORE the
    // fallback response, otherwise every DELETE request gets the 404
    // sent first and then crashes trying to send a second response.
    if (req.method === "DELETE" && req.url.startsWith("/user/")) {

        const id = Number(req.url.split("/")[2]);
        const users = JSON.parse(
            fs.readFileSync(USERS_FILE, "utf8")
        );

        let userindex = users.findIndex(user => user.id === id);

        if (userindex === -1) {
            res.writeHead(404, {
                "Content-Type": "application/json"
            });
            return res.end(JSON.stringify({ message: "User not found" }));
        } else {
            users.splice(userindex, 1);
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            return res.end(JSON.stringify({
                message: "User deleted successfully",
                user: users
            }));
        }
    }


//
// 4)Create an API that gets all users from the JSON file.
    if (req.method === "GET" && req.url === "/user"){
        const users = JSON.parse(
            fs.readFileSync(USERS_FILE, "utf8")
        );
        res.writeHead(200, {
            "Content-Type": "application/json"
        })
        res.end(JSON.stringify({users: users}));
    }
//     5)Create an API that gets User by ID. (1 Grade)
    if (req.method === "GET" && req.url.startsWith("/user/")){
        const id = Number(req.url.split("/")[2]);
        const users = JSON.parse(
            fs.readFileSync(USERS_FILE, "utf8"))
        let userindex = users.findIndex(user => user.id === id);

        if (userindex === -1) {
            res.writeHead(404, {
                "Content-Type": "application/json"
            });
            return res.end(JSON.stringify({ message: "User not found" }));
        } else {
res.writeHead(200, {
    "Content-Type": "application/json"
})
            res.end(JSON.stringify({user: users[userindex]}));
        }

    }
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
