import { GameRoom } from './rooms/MyRoom';
import config from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';

/**
 * Import your Room files
 */

export default config({
	initializeGameServer: (gameServer) => {
		/**
		 * Define your room handlers:
		 */
		gameServer.define('my_room', GameRoom);
		if (process.env.NODE_ENV !== 'production') {
			// simulate 200ms latency between server and client.
			gameServer.simulateLatency(200);
		}
	},

	initializeExpress: (app) => {
		/**
		 * Bind your custom express routes here:
		 * Read more: https://expressjs.com/en/starter/basic-routing.html
		 */
		app.get('/hello_world', (req, res) => {
			res.send("It's time to kick ass and chew bubblegum!");
		});

		/**
		 * Use @colyseus/playground
		 * (It is not recommended to expose this route in a production environment)
		 */
		if (process.env.NODE_ENV !== 'production') {
			app.use('/', playground());
		}

		/**
		 * Use @colyseus/monitor
		 * It is recommended to protect this route with a password
		 * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
		 */
		app.use('/colyseus', monitor());
	},

	beforeListen: () => {
		/**
		 * Before before gameServer.listen() is called.
		 */
	},
	// options: {
	// 	devMode: true,
	// },
});
