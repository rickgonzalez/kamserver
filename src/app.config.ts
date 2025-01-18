import config from "@colyseus/tools";

import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { ClientState, RelayRoom ,LobbyRoom } from "colyseus";
import { matchMaker,  } from "colyseus";

import { Room, Client } from "colyseus";
import {providerData} from "./components/providers"
//import { AzariaState } from "./rooms/schema/AzariaState"
import { WebSocketTransport } from "@colyseus/ws-transport"
/**
 * Import your Room files
 */
import { AzariaRoom } from "./rooms/AzariaRoom";
import { AzariaState } from "./rooms/schema/AzariaState";
//import { AzariaState } from "./rooms/schema/AzariaState";




export default config({
  

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
       // Expose the "lobby" room.
        gameServer
        .define("lobby", LobbyRoom);

        gameServer
        .define("AzariaRoom", AzariaRoom, {
            maxClients: 100,  
            allowReconnectionTime:  60 * 60 * 2,

        })
        .enableRealtimeListing();

        
        // Expose your relayed room
        gameServer.define("Relay", RelayRoom, {
            maxClients: 100,
            allowReconnectionTime: 120
        });

    }, 
    initializeTransport: function(opts) {
        return new WebSocketTransport({
          ...opts,
          pingInterval: 5000,
          pingMaxRetries: 24,
          maxPayload: 4096, 
        });
      },
    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
       
        // Joining a game               /rooms/{roomId}
                // Deleting a Room              /rooms/{roomId}
        // Getting Player Information   /players/{playerId}
                 // Exit Player from room        /rooms/{roomId}/{playerId}
        // Messaging                    message/rooms/{roomId}  /message/players/{playerId}
        
        app.get("/kam/providers", async(req, res) => {
           // res.send(JSON.stringify(providerdata));
           var Applications;
                try {
                     Applications = await matchMaker.query({ name: "Azaria"});
                } catch (e) {
                    console.error("error listing providers ", e);
                    res.json({ 'error listing providers':e });
                } 

                res.json(providerData);
        });

        app.get("/kam/rooms", async(req, res) => {
            var rooms;
                try {
                     rooms = await matchMaker.query({ name: "AzariaRoom"});
                } catch (e) {
                    console.error("error listing rooms ", e);
                    res.json({ 'error listing rooms':e });
                } 

                res.json({ rooms });
        });

        //post the session back to accept the reservation
        app.post("/kam/rooms/acceptReservation", async(req, res) => {
            var mysessionId : string
            var myroomId: string
            myroomId = req.body.myroomId;
            mysessionId = req.body.mysessionId;
            
            console.log("request body", req.body);
            
                try {
                     // console.log('client',client);
                  //  await matchMaker.remoteRoomCall(myroomId, "_onLeave", [{sessionId: mysessionId}]);
                    await matchMaker.remoteRoomCall(myroomId, "_onJoin", [{sessionId: mysessionId}]);
                 
                } catch (e) {
                    console.error("error accepting reservation ", e);
                    res.json({ 'error accepting reservation':e });
                } 

                //return something in the response
                res.json({"sessionId":mysessionId});
        });

        app.get("/kam/players/:roomId", async(req, res) => {
            var room : any
            var players: any
            var roomid = req.params.roomId;
            var reservation;
                try {
                     reservation = await matchMaker.joinById(roomid, {playerName: 'auditor'});
                } catch (e) {
                    console.error("error listing players ", e);
                    res.json({ 'error listing players':e });
                } 
            //room = reservation.room;
            //players = AzariaRoom.prototype.enumPlayersByRoom(room);

            res.json(AzariaRoom.prototype.state.players);

        });



        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }
        
        // app.use("/", playground);
  
        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});


