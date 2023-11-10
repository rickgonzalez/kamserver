
import { Room, Client } from "colyseus";
import { Schema, MapSchema, CollectionSchema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") sessionId: string;
  @type("string") name: string;
  @type("string") playerId: string;
  @type("string") ip: string;
  @type("boolean") connected: boolean;


}

export class AzariaState extends Schema {
  @type({ map: Player }) 
  players = new MapSchema<Player>();


  createPlayer(sessionId: string) {
    this.players.set(sessionId, new Player());

  }

  updatePlayer(sessionId: string, ip: string, name: string, playerId:string) {
    this.players.get(sessionId).ip = ip;
    this.players.get(sessionId).name = name;
    this.players.get(sessionId).connected = true;
    this.players.get(sessionId).playerId = playerId;
}



  removePlayer(sessionId: string) {
    this.players.get(sessionId).connected = false;
    this.players.delete(sessionId);
  }

}

