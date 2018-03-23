
export class PeerNode {

    id: string;

    listenPort: number;

    ip: string;

    displayName: string;


    myName() {
        return this.displayName;
    }

}