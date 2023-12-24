import { Room, Client} from "@colyseus/core";
import { AzariaState, Player } from "./schema/AzariaState";



export class AzariaRoom extends Room<AzariaState> {

  
  maxClients = 50;
 
  onCreate (options: any) {
    this.setState(new AzariaState());
    //We want to update the rooms state and store players ip as playerHost value
    
  
    let myIdString = this.roomId + options.fname ;
    this.roomId = myIdString;
    this.state.createRoomDetail(options.fname);
    this.setSeatReservationTime (300);
    this.autoDispose = false;
   

    this.onMessage("messages",(client, message) => {
      console.log("ChatRoom received message from", client.sessionId, ":", message.message);
      this.broadcast("messages", `(${client.sessionId}) ${message.message}`);
     
    });
    this.onMessage("chat",(client, message) => {
      // console.log("ChatRoom received message from", client.sessionId, ":", message.message);
      this.broadcast("chat", `(${options.name}) ${message.message}`);
     
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
   // this.broadcast("messages", `${ client.sessionId } joined.`);
    this.broadcast("messages", `${ options.name } joined.`);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.removePlayer(client.sessionId);
      //Maybe check consented ? reconnect logic here
      this.broadcast("messages", `${ client.sessionId } left.`);

  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
