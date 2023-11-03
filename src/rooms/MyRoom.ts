import { Room, Client} from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Request } from "express";

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
 onAuth (client: Client, options: any, myrequest:Request ) {
   
    console.log("maybe an ip ", myrequest.ip );

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
