/**
 *
 */
import { PeerNode } from "./PeerNode";
import { PeerService } from "./PeerService";

const peerNode = new PeerNode();
peerNode.displayName = "Hello world";

// this is suppose to be some hash which dont change
peerNode.id = "1";


const peerService = new PeerService(peerNode);

console.log(peerNode.myName());

const http = require("http");
const request = require("request");
const chalk = require("chalk");
const querystring = require("querystring");

require("string.prototype.startswith");

const hostname = "127.0.0.1";

const server = http.createServer((request: any, response: any) => {

    const { headers, method, url } = request;

    if (url != "/favicon.ico") {

        if (url == "/message") {

            let body: any = [];

            request.on("data", (chunk: any) => {
                body.push(chunk);
            }).on("end", () => {
                body = Buffer.concat(body).toString();
                // console.log(body);

                const post = querystring.parse(body);
                console.log(chalk.red.bgWhite(post.displayName) + ": " + post.message);

            });

        }

        response.statusCode = 200;
        response.setHeader("Content-Type", "text/plain");
        response.end("Hello World test\n");
    }

});



const stdin = process.openStdin();

console.log("> To set display name write " + chalk.red.bgWhite("name [display-name]"));
console.log("> To connect chat write " + chalk.red.bgWhite("connect [port-to-listen]"));
console.log("> To send message write " + chalk.red.bgWhite("# [your-message]"));
// console.log("To send message to user write " + chalk.red.bgWhite("@[display-name] [your-message]"));


stdin.addListener("data", function(d) {

    const input: string = d.toString().trim();

    if (input.startsWith("name")) {
        peerNode.displayName = input.substring(5);
        console.log("> Name changed");
    }

    if (input.startsWith("#")) {
        const myMessage = input.substring(2);
        peerService.pushToPeers(myMessage);
    }

    if (input.startsWith("connect")) {

        const port = input.substring(8);

        console.log(chalk.blue.bgRed("> Trying to get peer list... "));
        peerService.locatePeers();

        server.listen(port, () => {
            // console.log(chalk.blue.bgWhite(`Server listens on http://${hostname}:${port}/`));
        });
    }


  });




