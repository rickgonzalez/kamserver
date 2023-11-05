import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { RelayRoom } from "colyseus";
import { matchMaker } from "colyseus";

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
       
        app.get("/rooms", async(req, res) => {
            const rooms = await matchMaker.query({ name: "my_room" });
            console.log(rooms);
            res.send(rooms[0]);
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
