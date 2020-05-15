const {Pinski} = require("pinski")
const {setInstance} = require("pinski/plugins")

const server = new Pinski({
	port: 3000,
	relativeRoot: __dirname
})


server.addAPIDir("api")
server.startServer()

setInstance(server)
