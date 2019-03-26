const Discord = require("discord.js");
const express = require('express');
const client = new Discord.Client();
const config = require("./config.json");
const Enmap = require("enmap");
const fs = require("fs");
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

let username;
let discriminator;

client.on("ready", () => {
    console.log("AtomUtility V"+config.version);
});

client.config = config;

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.login(config.token);

// Web Interface

var app = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new DiscordStrategy({
  clientID: '',
  clientSecret: '',
  callbackURL: 'http://localhost:8080/auth/discord/callback',
  scope: ["identify"]
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
      return done(null, profile);
  });
}));

app.use(express.static(__dirname + '/views'));

app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function(req, res) {
    userId = req.user.id;
    username = req.user.username;
    discriminator = req.user.discriminator;
    avatar = req.user.avatar;
    res.redirect('/profile') // Successful auth
});

app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    res.render('index.ejs', {version: config.version});
});
app.get('/profile', function(req, res) {
  res.render('profile.ejs', {
    userId: userId,
    username: username, 
    discriminator: discriminator,
    avatar: avatar
  });
});
app.get('/project', function(req, res) {
  res.render('project.ejs', {
    username: username, 
    discriminator: discriminator
  });
});

app.listen(8080, () => console.log('Web interface active'));