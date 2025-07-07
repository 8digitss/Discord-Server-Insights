require('dotenv').config();
const express = require('express');
const session = require('express-session');
const fetch = require('node-fetch');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const PORT = 3000;

// Initialize Discord bot client with intents for guild info and members
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

bot.login(process.env.BOT_TOKEN)
  .then(() => console.log('Bot logged in successfully!'))
  .catch(console.error);

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Simple session middleware to keep track of logged in users
app.use(session({
  secret: process.env.SESSION_SECRET || 'some secret here',
  resave: false,
  saveUninitialized: false
}));

// Discord OAuth2 scopes we need to get user info and servers
const OAUTH_SCOPES = ['identify', 'guilds'];
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || `http://localhost:${PORT}/callback`;

// URL to redirect users to Discord login for authorization
const oauthUrl = `https://discord.com/api/oauth2/authorize?` +
  `client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${OAUTH_SCOPES.join('%20')}`;

app.get('/', (req, res) => {
  // If user not logged in, send them to Discord login page
  if (!req.session.user) {
    return res.redirect(oauthUrl);
  }
  // Otherwise, send them to dashboard
  res.redirect('/dashboard');
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    // No code? Back to login start
    return res.redirect('/');
  }

  try {
    // Exchange code for access token
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('scope', OAUTH_SCOPES.join(' '));

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('OAuth token error:', tokenData.error);
      return res.redirect('/');
    }

    // Get the user's Discord info with the access token
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();

    // Save user info in session to track login
    req.session.user = userData;

    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error during OAuth callback:', err);
    res.redirect('/');
  }
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    // Not logged in? Go back to login
    return res.redirect('/');
  }

  // Get list of guilds where bot is a member
  const guilds = bot.guilds.cache.map(guild => ({
    id: guild.id,
    name: guild.name,
    memberCount: guild.memberCount,
  }));

  // Render the dashboard page with user info and guilds
  res.render('dashboard', { user: req.session.user, guilds });
});

app.listen(PORT, () => {
  console.log(`App is up and running on http://localhost:${PORT}`);
});