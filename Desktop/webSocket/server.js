import { WebSocketServer } from "ws";

const PORT = 8080;
const server = new WebSocketServer({port: PORT});

console.log(`WS работает на порту ${PORT}`);

const clients = new Set();


server.on("connection", (ws) => {
	clients.add(ws);
	console.log('Новый клиент подключился!');

	ws.send(JSON.stringify({
		type: 'system',
		message: 'Welcome!'
	}))

	ws.on("message", (data) => {
		let parseData;
		try{
			parseData = JSON.parse(data)
		}
		catch (err){
			console.log("Произошла ошибка при обработке сообщения:" + err);
			return;
		}

		// const message = data.toString();
		clients.forEach(client => {
			// console.log(client);
			if(client.readyState == ws.OPEN) {
				client.send(JSON.stringify(parseData))
			}
		})
	});
	ws.on("close", () => {
		clients.delete(ws);
		console.log('Клиент отключился');
	});
})

