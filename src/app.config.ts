import config from "@colyseus/tools";
import { Room, Client, ClientArray} from "@colyseus/core";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { ClientState, RelayRoom } from "colyseus";
import { matchMaker } from "colyseus";
import providerdata from './components/providers.js';

/**
 * Import your Room files
 */
import { AzariaRoom } from "./rooms/AzariaRoom";

export default config({
  

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
       
        gameServer
        .define("AzariaRoom", AzariaRoom, {
            maxClients: 100, 
        });
        
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
        
        // app.get("/providers", async(req, res) => {
        //    // res.send(JSON.stringify(providerdata));
        //    res.json(providerdata);
        // });

        app.get("/playerstate", async(req, res) => {
            // const rooms = await matchMaker.query({ name: "AzariaRoom" });
            // res.json(rooms);
            const clients = AzariaRoom.prototype.clients.entries
            res.json(clients);
        });

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
