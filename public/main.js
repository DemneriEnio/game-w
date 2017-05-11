var socket = io();
var name = "";
var role = "";
var image = "";

$(document).ready(function() {

	$("#play").on("click", function() {

		$("body").html(`

			<h1 id="h1">Enter your name</h1><br>
		  <input placeholder="Enter your name..." type='text' id='name'></input>
		  <button id='submit'>Submit</button><br>
			<div id="ready"></div><br>
		  <h3>Players available</h3><br>
		  <div id='field'>

		  </div>
`);

		$("#name").select();

	});

	$(document).on("click", "#submit", function() {

		name = $("#name").val();
		socket.emit("player status", name);

		$("#submit").prop("disabled", true);
		$("#name").prop("disabled", true);
		$("#ready").html("<h4>Are you ready?</h4><br><button id='ready-btn'>YES</button>");

	});

	socket.on("name taken", function() {

		$("#submit").prop("disabled", false);
		$("#name").prop("disabled", false);
		$("#ready").html("<br><p>Name is already taken. Please choose another name</p>");

	});

	$(document).on("click", "#ready-btn", function() {

		socket.emit("ready", name);
		$("#ready-btn").prop("disabled", true);
		$("#ready").html("<br><p>Please wait for other players</p>");

	});

	socket.on("online players", function(arr) {

		$("#h1").html("Hello " + name);

		$("#field").html("");

		for (var i = 0; i < arr.length; i++) {
			if (arr[i].ready === 0) {
				if (name == arr[i].name) {
					$("#field").append("<p>Player <strong>" + arr[i].name + "</strong> is online</p><br>");
				} else {
					$("#field").append("<p>Player " + arr[i].name + " is online</p><br>");
				}
			} else {
				if (name == arr[i].name) {
					$("#field").append("<p>Player <strong>" + arr[i].name + "</strong> is ready to play</p><br>");
				} else
					$("#field").append("<p>Player " + arr[i].name + " is ready to play</p><br>");
			}

		}

	});

	socket.on("starting game", function(data, p) {

		for (var i = 0; i < data.length; i++) {

			if (p[i] == name) {
				console.log(name);
				role = data[i].role;
				console.log(role);
			}
			if (role == 'werewolf') {
				image = 'cards/werewolf.png';
			} else if (role == 'villager') {
				image = 'cards/villager.jpeg';
			} else if (role == 'seer') {
				image = 'cards/seer.jpeg';
			} else if (role == 'doctor') {
				image = 'cards/doctor.jpeg';
			}
		}


		$("body").html(`
			<h1>Night</h1>
			<h2>` + name + `<h2>
			<h3>You are the ` + role + `</h3>
			<image id='role' src=` + image + `</image>
			<br>
		`);

		for (var j = 0; j < data.length; j++) {

			if (name == p[j]) continue;

			if (role == "werewolf") {
				//$("#field").html("<div><img class='images' src='cards/werewolf.png'</div><br>");
				$("body").append("<p>Choose a player to kill.</p><br><br>");
				$("body").append("<div><p>Kill " + p[j] + "?</p><button class='action kill' id='kill-" + String(i) + "'>YES</button></div><br>");
			} else if (role == "villager") {
				//$("#field").html("<div><img class='images' src='cards/villager.jpeg'</div><br>");
				$("body").append("<p>Choose a player to suspect.</p><br><br>");
				$("body").append("<div><p>Suspect " + p[j] + "?</p><button class='action suspect' id='suspect-" + String(i) + "'>YES</button></div><br>");
			} else if (role == "seer") {
				//$("#field").html("<div><img class='images' src='cards/seer.jpeg'</div><br>");
				$("body").append("<p>Choose a player to foretell.</p><br><br>");
				$("body").append("<div><p>Foretell " + p[j] + "?</p><button class='action foretell' id='foretell-" + String(i) + "'>YES</button></div><br>");
			} else if (role == "doctor") {
				//$("#field").html("<a href="http://tinypic.com?ref=2i07q76" target="_blank"><img src="http://i66.tinypic.com/2i07q76.jpg" border="0" alt="Image and video hosting by TinyPic"></a>");
				$("body").append("<p>Choose a player to heal.</p><br><br>");
				$("body").append("<div><p>Heal " + p[j] + "?</p><button class='action heal' id='heal-" + String(i) + "'>YES</button></div><br>");
			}

		}

	});

	window.onbeforeunload = function() {
		socket.emit("leaving", name);
	};

});
