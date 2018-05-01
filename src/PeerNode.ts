const md5 = require("md5");

export class PeerNode {

    id: string;

    port: number = 0;

    ip: string;

    displayName: string;


    myName() {
        return this.displayName;
    }

    /**
     * Just simple way of generating an ID for the peer
     */
    generateId() {
        const myDate = new Date();
        this.id = md5(myDate.getTime());

    }

}