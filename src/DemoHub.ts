const http = require("http");
const chalk = require("chalk");
const querystring = require("querystring");

require("string.prototype.startswith");

import { PeerNode } from "./peernode";


/**
 * A simple local server acting as a hub for new peers
 */
export class DemoHub {

    peers: PeerNode[] = Array();

    startServer(port: number) {

        const server = http.createServer((request: any, response: any) => {

            const { headers, method, url } = request;

            if (url == "/checkin") {


                let body: any = [];

                request.on("data", (chunk: any) => {
                    body.push(chunk);
                }).on("end", () => {
                    body = Buffer.concat(body).toString();

                    const post = querystring.parse(body);

                    const peer = new PeerNode();
                    peer.listenPort = post.port;
                    peer.displayName = post.displayName;
                    peer.id = post.id;
                    peer.ip = request.connection.remoteAddress;

                    if (peer.ip.startsWith("::ffff:"))
                        peer.ip = peer.ip.substr(7);

                    if (peer.id != undefined)
                        this.peers.push(peer);

                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json");
                    response.end(JSON.stringify(this.peers));
                });


            }

        });

        server.listen(port, () => {
            console.log(chalk.blue.bgWhite("DemoHub server started"));
        });
    }

}