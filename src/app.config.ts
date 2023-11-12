import config from "@colyseus/tools";

import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { ClientState, RelayRoom ,LobbyRoom } from "colyseus";
import { matchMaker,  } from "colyseus";

import { Room, Client } from "colyseus";
import {providerData} from "./components/providers"
//import { AzariaState } from "./rooms/schema/AzariaState"

/**
 * Import your Room files
 */
import { AzariaRoom } from "./rooms/AzariaRoom";
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
            maxClients: 50,  
        })
        .enableRealtimeListing();

        
        // Expose your relayed room
        gameServer.define("Relay", RelayRoom, {
            maxClients: 100,
            allowReconnectionTime: 120
        });

    },

    
    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        // Request Available Networks   /providers
        // Get Rooms                    /rooms
        // Creating a game room         /rooms
        // Joining a game               /rooms/{roomId}
                // Deleting a Room              /rooms/{roomId}
        // Getting Player Information   /players/{playerId}
                 // Exit Player from room        /rooms/{roomId}/{playerId}
        // Messaging                    message/rooms/{roomId}  /message/players/{playerId}
        
        app.get("/kam/providers", async(req, res) => {
           // res.send(JSON.stringify(providerdata));
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

            res.json(AzariaRoom);

        });



        




        // app.get("/players", async(req, res) => {
        //     res.json(this.state.first);
        //     // const reservation = await client.joinById("xxxxxxxxx", {});
        //     // reservation.room.roomId
        // });

        // app.post('/rooms', async(req, res) => {
        //     let mypost = Object(req.body);
        //     let roomName = mypost["roomName"];
        //     let playerName = mypost["playerName"];
        //     let hostIp = mypost["playerIp"]
        //     const room = await matchMaker.joinOrCreate(roomName, { ip: hostIp , name: playerName });
        //     console.log(room);
        //     res.json(room);
            
        //   });



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
