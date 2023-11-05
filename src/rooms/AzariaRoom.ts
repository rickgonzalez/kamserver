import { Room, Client} from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
const requestIp = require('request-ip');
import http from "http";


export class AzariaRoom extends Room<MyRoomState> {
  maxClients = 50;

  onCreate (options: any) {
    this.setState(new MyRoomState());
    //We want to update the rooms state and store players ip as playerHost value

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }
 onAuth (client: Client, options: any, request: http.IncomingMessage ) {
     //request previously set to any
     // request.socket.remoteAddress ? clientIp = request.socket.remoteAddress : clientIp = request.headers['x-forwarded-for'];
     const clientIp = requestIp.getClientIp(request); 
      client.send("ip", clientIp);
      console.dir(request);
      console.log('request ip-->',clientIp);
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
