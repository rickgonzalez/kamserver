import { Room, Client} from "@colyseus/core";
import { AzariaState } from "./schema/AzariaState";



export class AzariaRoom extends Room<AzariaState> {

  
  maxClients = 50;
 
  onCreate (options: any) {
    this.setState(new AzariaState());
    //We want to update the rooms state and store players ip as playerHost value
    this.state.createRoomDetail(options.fname);
    this.setSeatReservationTime (300);
    this.autoDispose = true;
   




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
    this.state.createPlayer(client.sessionId);
    this.state.updatePlayer(client.sessionId,options.ip,options.name,options.playerId);
    console.log(this.state.toJSON());
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.removePlayer(client.sessionId);
      //Maybe check consented ? reconnect logic here

  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
