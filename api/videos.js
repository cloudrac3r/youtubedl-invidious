const {promisify: p} = require("util")
const {rewriteLocation, thumbnails} = require("./utils")
const ytdl = require("youtube-dl")

module.exports = [
	{
		route: "/api/v1/videos/([a-zA-Z0-9_-]+)", methods: ["GET"], code: ({req, url, fill}) => {
			const headers = req.headers
			const local = url.searchParams.has("local") && ["true", "1"].includes(url.searchParams.get("local"))
			function optionalLocal(location) {
				const host = headers["host"] + "/" || headers["Host"] + "/" || url
				return local ? rewriteLocation(location) : location
			}
			return p(ytdl.getInfo)(fill[0]).then(/** @param {any} info */ info => {
				return {
					statusCode: 200,
					contentType: "application/json",
					content: {
						type: "video",
						title: info.title,
						videoId: info.id,
						videoThumbnails: thumbnails(info.id),
						description: info.description,
						descriptionHtml: info.descriptionHtml,
						published: Math.floor(new Date(`${info.upload_date.slice(0, 4)}-${info.upload_date.slice(4, 6)}-${info.upload_date.slice(6, 8)} UTC`).getTime()/1000),
						publishedText: "publishedText not implemented",
						keywords: info.tags,
						viewCount: info.view_count,
						likeCount: info.like_count,
						dislikeCount: info.dislike_count,
						paid: false,
						premium: false,
						isFamilyFriendly: info.age_limit === 0,
						allowedRegions: [],
						genre: "genre not implemented",
						genreUrl: "genreUrl not implemented",
						author: info.uploader,
						authorId: info.channel_id,
						authorUrl: "/channel/"+info.channel_id,
						uploader: info.uploader,
						uploaderId: info.uploader_id,
						uploaderUrl: info.uploader_url,
						authorThumbnails: [],
						subCountText: "subCountText not implemented",
						lengthSeconds: info._duration_raw,
						allowRatings: true,
						rating: info.average_rating,
						isListed: true,
						liveNow: false,
						isUpcoming: false,
						premiereTimestamp: null,
						hlsUrl: null,
						adaptiveFormats: info.formats.filter(f => f.acodec === "none" || f.vcodec === "none").map(f => ({
							index: null,
							bitrate: Math.floor(f.tbr*1000)+"",
							init: null,
							url:
								f.protocol === "http_dash_segments"
									? optionalLocal(f.fragment_base_url)
									: optionalLocal(f.url)
							,
							itag: f.format_id,
							type:
								f.acodec === "none"
									? `video/${f.ext}; codecs="${f.vcodec}"` // video only
									: `audio/${f.ext}; codecs="${f.acodec}"` // audio only
							,
							clen: f.filesize+"",
							lmt: null,
							projectionType: null,
							container: f.ext,
							encoding: null,
							qualityLabel: f.format_note,
							resolution: f.format_note
						})),
						formatStreams: info.formats.filter(f => f.acodec !== "none" && f.vcodec !== "none").map(f => ({
							url: optionalLocal(f.url),
							itag: f.format_id,
							type: `video/${f.ext}; codecs="${f.vcodec}, ${f.acodec}"`,
							quality: null,
							container: f.ext,
							encoding: null,
							qualityLabel: f.format_note,
							resolution: f.format_note,
							size: (f.format.match(/\S+x\S+/) || [])[0] || null
						})),
						captions: [],
						storyboards: [],
						recommendedVideos: []
					}
				}
			}).catch(e => {
				const saidString = "YouTube said: "
				console.error(e)
				if (e.stderr && e.stderr.includes("Sign in to confirm your age")) {
					return {
						statusCode: 403,
						contentType: "application/json",
						content: {
							error: "This video is age restricted."
						}
					}
				} else if (e.stderr && e.stderr.includes(saidString)) {
					let said = e.stderr.slice(e.stderr.indexOf(saidString))
					let saidSuffix = said.slice(saidString.length)
					if (saidSuffix === "Unable to extract video data") {
						said = saidSuffix + ". This video was probably removed."
					}
					return {
						statusCode: 403,
						contentType: "application/json",
						content: {
							error: said,
							saidSuffix
						}
					}
				} else {
					return {
						statusCode: 500,
						contentType: "application/json",
						content: {
							error: "Unknown error (ytdi)"
						}
					}
				}
			})
		}
	}
]
