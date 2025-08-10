# Appstorrent.org API Scraper

Educational Node.js/TypeScript API that scrapes public pages from `https://appstorrent.org` and exposes clean JSON endpoints for Programs and Games (including Categories). This project is for learning and research only. It is not affiliated with or endorsed by Appstorrent.

## Disclaimer

- For educational and research purposes only
- Do not use this project to violate any website's Terms of Service
- Respect robots.txt, rate limits, and local laws

## Tech Stack

- Node.js, Express
- TypeScript
- Axios, Cheerio

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone <your-repo-url>
cd appstorrent-api
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
# required: base URL to scrape
URL=https://appstorrent.org

# optional: server port (default 8080)
PORT=
```

### Run (Development)

```bash
npm run serve
```

This runs TypeScript in watch mode and restarts the server on changes.

### Run (Production)

```bash
npm run build
npm start
```

## Endpoints

Base URL: `http://localhost:<PORT>` (default `http://localhost:8080`)

### Info

- GET `/` → Returns basic info and current `URL` target

### Programs

- GET `/programs` — Latest programs
  - Query: `page` (number, optional; when `page > 1`, pagination is applied)
- GET `/program/:id` — Program details by ID

### Games

- GET `/games` — Latest games
  - Query: `page` (number, optional; when `page > 1`, pagination is applied)
- GET `/game/:id` — Game details by ID

### Categories

- GET `/programs-category` — List of available program categories
- GET `/programs-category/:category` — Programs by category
  - Query: `page` (number, optional)
- GET `/games-category` — List of available game categories
- GET `/games-category/:category` — Games by category
  - Query: `page` (number, optional)

## Examples

```bash
# Latest programs (first page)
curl "http://localhost:8080/programs"

# Latest programs (page 3)
curl "http://localhost:8080/programs?page=3"

# Program details
curl "http://localhost:8080/program/12345"

# Games by category with pagination
curl "http://localhost:8080/games-category/action?page=2"
```

## TODO / Roadmap

- Caching layer to reduce repeated requests (e.g., in-memory cache or Redis)
- Windows programs endpoint (extend beyond current macOS-focused content)

## License

MIT
