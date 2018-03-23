/**
 *
 */
import { PeerNode } from "./PeerNode";
import { PeerService } from "./PeerService";
import { DemoHub } from "./DemoHub";


const http = require("http");
const request = require("request");
const chalk = require("chalk");
const querystring = require("querystring");

require("string.prototype.startswith");
const md5 = require("md5");

// create my own peer
const peerNode = new PeerNode();
peerNode.displayName = "Hello world";

const myDate = new Date();
peerNode.id = md5(myDate.getTime());
console.log("Your id is set to: " + peerNode.id);

const peerService = new PeerService(peerNode);

const hub = new DemoHub(peerService);



const stdin = process.openStdin();

console.log("> To start local demohub write " + chalk.red.bgWhite("demohub [port-to-listen]"));
console.log("> To hub info write " + chalk.red.bgWhite("hubport [port-to-connect]"));
console.log("> To set display name write " + chalk.red.bgWhite("name [display-name]"));
console.log("> To connect existing hub write " + chalk.red.bgWhite("connect [port-to-listen]"));
console.log("> To send message write " + chalk.red.bgWhite("# [your-message]"));
// console.log("To send message to user write " + chalk.red.bgWhite("@[display-name] [your-message]"));


stdin.addListener("data", function(d) {

    const input: string = d.toString().trim();

    if (input.startsWith("name")) {
        peerNode.displayName = input.substring(5);
        console.log("> Name changed");
    }

    if (input.startsWith("demohub")) {
        const port = parseInt(input.substring(8));
        peerNode.listenPort = port;
        peerNode.ip = "127.0.0.1";
        hub.startServer(port);

    }

    /**
     * If this is started then one shouldnt be able to run connect.
     * Or least need to check if demohub is running. The peerservice
     * could connect to another client
     */
    if (input.startsWith("hubport")) {
        const port = input.substring(8);
        peerService.hubPort = parseInt(port);
    }

    if (input.startsWith("#")) {
        const myMessage = input.substring(2);
        peerService.pushToPeers(myMessage);
    }

    if (input.startsWith("connect")) {

        const port = input.substring(8);
        peerNode.listenPort = parseInt(port);

        console.log(chalk.blue.bgRed("> Trying to get peer list... "));
        peerService.locatePeers();

        hub.startServer(parseInt(port));

    }


  });




