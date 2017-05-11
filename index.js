var express = require("express");
var socket_io = require("socket.io");
var http = require("http");

var app = express();
app.use(express.static("public"));

var server = http.Server(app);
var io = socket_io(server);
var players = [];
var p = [];
var countReady = 0;
var a = 0,
	b = 0,
	c = 1,
	d = 1;

io.on("connection", function(socket) {

	io.emit("connect");

	socket.on("player status", function(player) {

		if (p.indexOf(player) == -1) {

			players.push({
				"name": player,
				"ready": 0,
				"role": "",
				"alive": 1,
				"healed": 0
			});

			p.push(player);

			console.log(players);

			io.emit("online players", players);
		} else {
			socket.emit("name taken", player);
		}

	});

	socket.on("ready", function(player) {

		players.splice(p.indexOf(player), 1, {
			"name": player,
			"ready": 1,
			"role": "",
			"alive": 1,
			"healed": 0
		});

		countReady++;

		if (countReady >= 7 && countReady == players.length) {

			if (players.length <= 11) {
				a = 2;
				b = players.length - 4;
			} else {
				a = 3;
				b = players.length - 5;
			}

			for (var i = 0; i < players.length; i++) {

				var random = Math.floor(Math.random() * 4 + 1);

				if (random == 1 && a > 0) {
					players.splice(i, 1, {
						"name": player,
						"ready": 1,
						"role": "werewolf",
						"alive": 1,
						"healed": 0
					});
					a--;
				} else if (random == 2 && b > 0) {
					players.splice(i, 1, {
						"name": player,
						"ready": 1,
						"role": "villager",
						"alive": 1,
						"healed": 0
					});
					b--;
				} else if (random == 3 && c > 0) {
					players.splice(i, 1, {
						"name": player,
						"ready": 1,
						"role": "seer",
						"alive": 1,
						"healed": 0
					});
					c--;
				} else if (random == 4 && d > 0) {
					players.splice(i, 1, {
						"name": player,
						"ready": 1,
						"role": "doctor",
						"alive": 1,
						"healed": 0
					});
					d--;
				} else {
					i--;
				}

			}

			io.emit("starting game", players, p);
		} else {
			io.emit("online players", players);
		}

	});

	socket.on("leaving", function(player) {

		console.log(player + " left the game");
		players.splice(p.indexOf(player), 1);
		p.splice(p.indexOf(player), 1);

	});

});

server.listen(process.env.PORT || 8080);
