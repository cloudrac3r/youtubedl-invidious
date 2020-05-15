const {Pinski} = require("pinski")

const server = new Pinski({
	port: 3000,
	relativeRoot: __dirname
})

server.addAPIDir("api")
server.startServer()
