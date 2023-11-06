import { Room, Client} from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
const requestIp = require('request-ip');
import http from "http";


export class AzariaRoom extends Room<MyRoomState> {
  maxClients = 50;

  onCreate (options: any) {
    this.setState(new MyRoomState());
    //We want to update the rooms state and store players ip as playerHost value
    this.autoDispose = false;
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }
 onAuth (client: Client, options: any, request: any) {
     //request previously set to any http.IncomingMessage 
     //const clientIp = requestIp.getClientIp(request); 
    
      return true;
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.playerHost = client.id;

  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
