# Discord Server Insights Dashboard

A simple web dashboard that displays Discord server stats using OAuth2 and Discord.js.

## Features:
- Discord OAuth2 Login
- Shows servers where the bot is added
- Displays member counts per server
- Simple, clean UI (dark themed)

## Tech Stack:
- Node.js + Express
- Discord.js
- EJS (for views)
- CSS (for basic styling)

## Setup

1. Create a `.env` file:
```
CLIENT_ID=YOUR_CLIENT_ID
CLIENT_SECRET=YOUR_CLIENT_SECRET
BOT_TOKEN=YOUR_BOT_TOKEN
REDIRECT_URI=http://localhost:3000/callback
SESSION_SECRET=randomstring
```

2. Install dependencies:
```bash
npm install
```

3. Run the app:
```bash
npm start
```

## License:
This project is licensed under the terms of the MIT license.
