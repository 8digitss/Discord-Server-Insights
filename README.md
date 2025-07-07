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

## Setup:

## **Pre setup**

Create a folder and name it "discord-server-insights"

Create a folder within that folder and name it "public"

Place style.css in the folder "public"

Create a second folder within "discord-server-insights" and name it "views"

Place dashboard.ejs in the folder "views"

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
