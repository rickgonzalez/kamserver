
import { Room, Client } from "colyseus";
import { Schema, MapSchema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") sessionId: string;
  @type("string") ip: string;
  @type("boolean") connected: boolean;
  @type("string") name: string;

}

export class AzariaState extends Schema {
  @type({ map: Player }) Players = new MapSchema<Player>();


  createPlayer(sessionId: string) {
    this.Players.set(sessionId, new Player());

  }

  updatePlayer(sessionId: string, ip: string, name: string) {
    this.Players.get(sessionId).ip = ip;
    this.Players.get(sessionId).name = name;
}



  removePlayer(sessionId: string) {
    this.Players.get(sessionId).connected = false;
    this.Players.delete(sessionId);
  }

}


// export class StateHandlerRoom extends Room<AzariaState> {
//   maxClients = 4;

//   onCreate (options: any) {
//       console.log("StateHandlerRoom created!", options);

//       this.setState(new State());

//       this.onMessage("move", (client, data) => {
//           console.log("StateHandlerRoom received message from", client.sessionId, ":", data);
//           this.state.movePlayer(client.sessionId, data);
//       });
//   }

//   // onAuth(client, options, req) {
//   //     return true;
//   // }

//   onJoin (client: Client) {
//       // client.send("hello", "world");
//       console.log(client.sessionId, "joined!");
//       this.state.createPlayer(client.sessionId);
//   }

//   onLeave (client) {
//       console.log(client.sessionId, "left!");
//       this.state.removePlayer(client.sessionId);
//   }

//   onDispose () {
//       console.log("Dispose StateHandlerRoom");
//   }

// }




