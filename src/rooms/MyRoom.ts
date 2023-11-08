import { Room, Client} from "@colyseus/core";
import { AzariaState } from "./schema/AzariaState";
const requestIp = require('request-ip');
import http from "http";


export class MyRoom extends Room<AzariaState> {
  maxClients = 50;

  onCreate (options: any) {
    this.setState(new AzariaState());
  


    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }
 onAuth (client: Client, options: any, request: http.IncomingMessage ) {
  
      return true;
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    

  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
