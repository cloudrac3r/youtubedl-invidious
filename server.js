const {Pinski} = require("pinski")
const passthrough = require("./passthrough")

if (process.argv.slice(2).includes("-4")) passthrough.ip_mode = 4
if (process.argv.slice(2).includes("-6")) passthrough.ip_mode = 6

const server = new Pinski({
	port: 3000,
	relativeRoot: __dirname
})

server.addAPIDir("api")
server.startServer()
