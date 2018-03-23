
export class PeerNode {

    id: string;

    port: number = 0;

    ip: string;

    displayName: string;


    myName() {
        return this.displayName;
    }

}