import { Schema, CollectionSchema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") ip: string;
  @type("boolean") connected: boolean;
  @type("string") name: string;
  @type("string") sessionId: string;
}

export class AzariaState extends Schema {
  @type({ collection: Player }) Players = new CollectionSchema<Player>();
}




