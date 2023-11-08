import { Room, Client} from "@colyseus/core";
import { Player,AzariaState } from "./schema/AzariaState";
import http from "http";


export class AzariaRoom extends Room<AzariaState> {
  maxClients = 50;

  onCreate (options: any) {
    this.setState(new AzariaState());
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
    var myPlayer = new Player();
      myPlayer.connected = true;
      myPlayer.sessionId = client.sessionId;
      myPlayer.ip = "pending";
      myPlayer.name = "name pending"
    this.state.Players.add(myPlayer);

  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
