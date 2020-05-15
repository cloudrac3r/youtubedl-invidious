# A very creatively named project

Want to run Invidious to get data about YouTube videos, but it takes ages to build and uses too much memory and sometimes doesn't work and the api-only branch is outdated? This is for you.

This project is a webserver that mirrors the Invidious API, but forwards all calls to the youtube-dl command line rather than using Invidious's code. Responses are returned in the same format as Invidious, but youtube-dl doesn't quite provide all of the data, so some less important fields may be missing. Check the code to see which exactly.

## Endpoints

- `/api/v1/videos/{id}`

## Feature ideas

- Proxying streams
- IPv4/IPv6 switching
- Error messages
- Cache

## Not implemented endpoints

- search
- channel
- playlist
- trending
- stats

## Roadmap

I'm making this for myself, so don't expect missing features to be implemented ever. Pull requests are welcome if you have something to add.
