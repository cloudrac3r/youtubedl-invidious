const ytsr = require("ytsr")

module.exports = [
	{
		route: "/api/v1/search", methods: ["GET"], code: ({req, url, fill}) => {
			if (!url.searchParams.has("q")) {
				return {
					statusCode: 400,
					contentType: "application/json",
					content: {
						error: "Specify the search query using the `q` query string parameter."
					}
				}
			}
			const query = url.searchParams.get("q")
			return ytsr(query).then(results => {
				return {
					statusCode: 200,
					contentType: "application/json",
					content: results.items.filter(result => result.type === "video").map(result => ({ // sorry, only video supported right now!
						type: "video",
						title: result.title,
						videoId: new URL(result.link).searchParams.get("v"),
						author: result.author.name,
						authorId: result.author.ref.split("/").slice(-1)[0],
						authorUrl: result.author.ref,
						description: result.description,
						descriptionHtml: "",
						viewCount: result.views,
						published: null,
						publishedText: result.uploaded_at,
						lengthSeconds: result.duration && result.duration.split(":").reverse().reduce((a, c, i) => a + (+c) * 60 ** i, 0) || 0,
						// @ts-ignore lib typings are incorrect
						liveNow: result.live || false,
						paid: false,
						premium: false
					}))
				}
			}).catch(error => {
				return {
					statusCode: 500,
					contentType: "application/json",
					content: {
						error: error.toString()
					}
				}
			})
		}
	}
]
