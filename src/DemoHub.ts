const http = require("http");
const chalk = require("chalk");
const querystring = require("querystring");

require("string.prototype.startswith");

import { PeerNode } from "./peernode";
import { PeerService } from "./peerservice";


/**
 * A simple local server acting as a hub for new peers
 */
export class DemoHub {

    // peers: PeerNode[] = Array();

    peerService: PeerService;

    request = require("request");

    constructor(peerService: PeerService) {
        this.peerService = peerService;
    }


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
                        this.peerService.addPeer(peer);

                    // for first connecting peer set peerservice to use
                    // that one as hub or make method findHub
                    if (this.peerService.initialPeers.length == 2)
                        this.peerService.hubPort = peer.listenPort;

                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json");
                    response.end(JSON.stringify(this.peerService.initialPeers));

                    for (const entry of this.peerService.initialPeers) {

                        if (entry.id != peer.id && entry.id != this.peerService.myCreds.id) {

                            // console.log(entry.id + " " + )

                            const options = {
                                url: "http://" + entry.ip + ":" + entry.listenPort + "/clients",
                                headers: {
                                "User-Agent": "Mozilla/5.0",
                                "Accept-Language": "*"
                                }
                            };

                            this.request(options,
                                (error: string, response: any, body: string) => {

                            });
                        }
                    }

                });

            }

            if (url == "/peers") {
                response.statusCode = 200;
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify(this.peerService.initialPeers));

            }

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

                response.statusCode = 200;
                response.setHeader("Content-Type", "application/json");
                response.end("1");

            }

            if (url == "/clients") {

                this.peerService.refreshPeers();

                response.statusCode = 200;
                response.setHeader("Content-Type", "application/json");
                response.end("1");

            }

        });

        server.listen(port, () => {
            console.log(chalk.blue.bgWhite("DemoHub server started"));
        });
    }

}