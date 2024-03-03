
import { Room, Client } from "colyseus";
import { Schema, MapSchema, CollectionSchema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") sessionId: string;
  @type("string") playerName: string;
  @type("string") playerId: string;
  @type("string") playerIp: string;
  @type("boolean") connected: boolean;
  @type([ "string" ]) candidates:Array<string>;
 
}
export class RoomDetail extends Schema {
  @type("string") roomId: string; 
  @type("string") friendlyName: string;
  @type("string") hostId: string; 
  @type("string") hostName: string; 
  @type("number") hostingStart:number;
  @type("string") hostingType:string;
}

export class AzariaState extends Schema {
  @type({ map: Player }) 
  players = new MapSchema<Player>();
  
  @type({map: RoomDetail})
  roomdetail = new MapSchema<RoomDetail>();


  createPlayer(sessionId: string) {
    this.players.set(sessionId, new Player());
  }

  //(options.fname, myIdString, options.playerId, options.name);
  createRoomDetail(roomId: string, fname: string, playerName: string, playerId: string) {
    this.roomdetail.set(roomId,  new RoomDetail());
    this.roomdetail.get(roomId).friendlyName = fname;
    this.roomdetail.get(roomId).hostName = playerName;
    this.roomdetail.get(roomId).hostId = playerId;
    let mystart = Date.now()
    this.roomdetail.get(roomId).hostingStart = mystart;
    this.roomdetail.get(roomId).hostingType = 'transferring';
  }

  updatePlayer(sessionId: string, playerIp: string, playerName: string, playerId:string, candidates:[string]) {
    this.players.get(sessionId).playerIp = playerIp;
    this.players.get(sessionId).playerName = playerName;
    this.players.get(sessionId).connected = true;
    this.players.get(sessionId).playerId = playerId;
    this.players.get(sessionId).candidates = candidates;
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

