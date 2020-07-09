const {promisify: p} = require("util")
const {thumbnails} = require("./utils")
const ytdl = require("youtube-dl")

module.exports = [
	{
		route: "/api/v1/(users|channels)/([\\w-]+)/videos", methods: ["GET"], code: async ({fill}) => {
			let type = fill[0]
			const name = fill[1]
			if (!name.startsWith("UC") || name.length !== 24) type = "users" // autodetect
			const response = await p(ytdl.exec)(`https://www.youtube.com/${type.slice(0, -1)}/${name}`, ["--dump-single-json", "--flat-playlist", "--playlist-end", "100"], {all: false})
			const root = JSON.parse(response[0])
			return {
				statusCode: 200,
				contentType: "application/json",
				content: root.entries.map(e => ({
					title: e.title,
					videoId: e.id,
					author: root.uploader,
					authorId: root.uploader_id,
					authorUrl: root.uploader_url,
					videoThumbnails: thumbnails(e.id)
				}))
			}
		}
	}
]
