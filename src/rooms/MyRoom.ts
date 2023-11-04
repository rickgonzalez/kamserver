import { Room, Client} from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
const requestIp = require('request-ip');

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new MyRoomState());
  
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }
 onAuth (client: Client, options: any, request: any ) {
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
