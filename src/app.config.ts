import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { RelayRoom } from "colyseus";
import * as Colyseus from "colyseus.js";

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";

export default config({
  

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MyRoom);
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
        var client = new Colyseus.Client('localhost:3000');
        let testval = '';
        async function getRooms() {
            try {
                client.getAvailableRooms("my_room").then(rooms => {
                    for (var i=0; i<rooms.length; i++) {
                        console.log("living room", rooms[i].roomId);
                        testval = rooms[i].roomId;
                    }
                  });
              
              } catch (e) {
                console.error("error listing rooms ", e);
              } 
          }
         
        app.get("/hello_world", async(req, res) => {
            await getRooms();
            res.send(testval);
        });

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }

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
