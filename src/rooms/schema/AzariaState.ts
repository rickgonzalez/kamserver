
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
    this.Players.get(sessionId).connected = true;
    this.Players.get(sessionId).name = name;
}



  removePlayer(sessionId: string) {
    this.Players.get(sessionId).connected = false;
    this.Players.delete(sessionId);
  }

}

