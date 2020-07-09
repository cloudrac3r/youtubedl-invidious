const thumbnailTypes = [
	{
		width: 1280,
		height: 720,
		name: "maxres",
		url: "maxres"
	},{
		width: 1280,
		height: 720,
		name: "maxresdefault",
		url: "maxresdefault"
	},{
		width: 640,
		height: 480,
		name: "sddefault",
		url: "sddefault"
	},{
		width: 480,
		height: 360,
		name: "high",
		url: "hqdefault"
	},{
		width: 320,
		height: 180,
		name: "medium",
		url: "mqdefault"
	},{
		width: 120,
		height: 90,
		name: "default",
		url: "default"
	}
]

function rewriteLocation(location) {
	const to = new URL(location)
	to.searchParams.set("host", to.hostname)
	return to.pathname + to.search
}

function thumbnails(id) {
	return thumbnailTypes.map(t => ({
		width: t.width,
		height: t.height,
		quality: t.name,
		url: `https://i.ytimg.com/vi/${id}/${t.url}.jpg`
	}))
}

module.exports.rewriteLocation = rewriteLocation
module.exports.thumbnails = thumbnails
