const {proxy} = require("pinski/plugins")
const {rewriteLocation} = require("./utils")

module.exports = [
	{
		route: "/proxy", methods: ["GET"], code: async ({url}) => {
			return {
				statusCode: 302,
				headers: {
					"Location": rewriteLocation(url.searchParams.get("url"))
				},
				contentType: "text/html; charset=UTF-8",
				content: "Redirecting...\n"
			}
		}
	},
	{
		route: "/videoplayback.*", methods: ["GET"], code: async ({url}) => {
			const target = new URL(url)
			target.protocol = "https:"
			target.port = "443"
			target.host = url.searchParams.get("host")
			target.searchParams.delete("host")
			return Promise.resolve(proxy(target, {}, h => {
				const result = {}
				let location
				if (location = h["location"] || h["Location"]) {
					result["Location"] = rewriteLocation(location)
				}
				return result
			}))
		}
	}
]
