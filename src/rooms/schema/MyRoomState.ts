import { Schema, Context, type } from "@colyseus/schema";

export class MyRoomState extends Schema {

  @type("string") playerHost: string = "pending iP Address";
  @type("string") hostDelegate1: string = "pending iP Address";
  @type("string") hostDelegate2: string = "pending iP Address";

}
