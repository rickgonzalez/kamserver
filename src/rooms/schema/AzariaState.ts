
import { Room, Client } from "colyseus";
import { Schema, MapSchema, CollectionSchema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") sessionId: string;
  @type("string") playerName: string;
  @type("string") playerId: string;
  @type("string") playerIp: string;
  @type("boolean") connected: boolean;
}
export class RoomDetail extends Schema {
  @type("string") friendlyName: string; //the first players friendly room name
}

export class AzariaState extends Schema {
  @type({ map: Player }) 
  players = new MapSchema<Player>();
  
  @type({map: RoomDetail})
  roomdetail = new MapSchema<RoomDetail>();


  createPlayer(sessionId: string) {
    this.players.set(sessionId, new Player());

  }
  createRoomDetail(fname: string) {
    this.roomdetail.set(fname, new RoomDetail());

  }

  updatePlayer(sessionId: string, playerIp: string, playerName: string, playerId:string) {
    this.players.get(sessionId).playerIp = playerIp;
    this.players.get(sessionId).playerName = playerName;
    this.players.get(sessionId).connected = true;
    this.players.get(sessionId).playerId = playerId;
}

  enumPlayers(roomId: string){
    this.players.forEach(function (player) {
      console.log(player.sessionId);
    });
  }

  removePlayer(sessionId: string) {
    this.players.get(sessionId).connected = false;
    this.players.delete(sessionId);
  }

}

