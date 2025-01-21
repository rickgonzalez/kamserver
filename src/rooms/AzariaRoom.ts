import { Room, Client} from "@colyseus/core";
import { AzariaState, Player } from "./schema/AzariaState";
import { reconnect } from "@colyseus/core/build/MatchMaker";



export class AzariaRoom extends Room<AzariaState> {

  
  maxClients = 50;
 
  onCreate (options: any) {
    if (options.roomtoken) {
      this.setPrivate();
    }
   
    this.setState(new AzariaState());
    //We want to update the rooms state and store players ip as playerHost value
    
  
    let myIdString = this.roomId + options.fname ;
    this.roomId = myIdString;
    this.state.createRoomDetail(myIdString, options.fname, options.name, options.playerId);
    this.setSeatReservationTime (300);
    this.autoDispose = true;
   

    this.onMessage("messages",(client, message) => {
      console.log("ChatRoom received message from", client.sessionId, ":", message.message);
      this.broadcast("messages", `(${client.sessionId}) ${message.message}`);
     
    });
    this.onMessage("chat",(client, message) => {
      // console.log("ChatRoom received message from", client.sessionId, ":", message.message);
      this.broadcast("chat", `[${message.name}] ${message.message}`);
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
    this.state.updatePlayer(client.sessionId,options.ip,options.name,client._reconnectionToken, options.playerId,options.candidates);
    console.log(this.state.toJSON());
   // this.broadcast("messages", `${ client.sessionId } joined.`);
    this.broadcast("messages", `${ options.name } joined.`);
  }

  async onLeave (client: Client, consented: boolean) {
    // flag client as inactive for other users
    this.state.players.get(client.sessionId).connected = false;
  
    try {
      if (consented) {
          throw new Error("consented leave");
      }
  
      // allow disconnected client to reconnect into this room until 200 seconds
      await this.allowReconnection(client, 200);
  
      // client returned! let's re-activate it.
      this.state.players.get(client.sessionId).connected = true;
  
    } catch (e) {
  
      // 20 seconds expired. let's remove the client.
      this.state.players.delete(client.sessionId);
    }
  }
  

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
