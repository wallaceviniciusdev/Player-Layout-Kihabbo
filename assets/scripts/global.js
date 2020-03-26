function missionCheck(){
	var formMission = $("#misson_check"),
		formMessage = $("#send_message");

	formMessage.hide();

	formMission.submit(function(event){
		var request = $.ajax({
			method: "GET",
			url: "missionCheckScript",
			data: {}
		});

		request.done(function(msg){
			$(this).addClass("animated bounceOutUp"); 
			$(this).fadeOut(300);
			formMessage.fadeIn(300);
			formMessage.addClass("animated bounceInUp");
		});

		request.fail(function(msg){
			$(this).addClass("animated shake");
		})

		event.preventDefault();
	});
}

function sendMessage(){
	var formMessage = $("#send_message");

	formMessage.submit(function(event){
		var request = $.ajax({
			method: "POST",
			url: "sendMessageScript",
			data: {}
		});

		request.done(function(msg){
		});

		request.fail(function(msg){
			$(this).addClass("animated shake");
		})

		event.preventDefault();
	});
}

function loadUtils(type, extradata) {
	return $.ajax({
		url: "http://api.mateusmelo.com/" + type,
		type: "GET",
		data: extradata
	});
}

function divEffects(){
	var player = $("#player");
	var logo = $("#logo");
	var chat = $("#chat");
	var chat_title = $("#chat .title");
	var title_square = $("#chat #messages");
	var inputs = $("#chat #inputs");
	var develp = $(".development");

	logo.hide();
	player.hide();
	chat_title.hide();
	title_square.hide();
	inputs.hide();
	develp.hide();

	$("#left-side").addClass(" animated bounceInDown");
	chat.addClass("animated bounceInUp");

	setTimeout(
		function(){
			develp.fadeIn(1000);
			develp.addClass(" animated heartBeat");
		}, 300);

	setTimeout(
		function(){
			inputs.fadeIn(100);
			inputs.addClass(" animated bounceInDown");
		}, 300);

	setTimeout(
		function(){
			title_square.fadeIn(100);
			title_square.addClass(" animated bounceInLeft");
		}, 300);

	setTimeout(
		function(){
			chat_title.fadeIn(100);
			chat_title.addClass(" animated bounceInRight");
		}, 300);

	setTimeout(
		function(){
			logo.fadeIn(100);
			logo.addClass(" animated bounceInLeft");
		}, 300);

	setTimeout(
		function(){
			player.fadeIn(100);
			player.addClass(" animated bounceInUp");
		}, 300);
}

$(document).ready(function() {
	var clickedFirst = 0;
	missionCheck();
	sendMessage();
	divEffects();
	var player = {
		refresh: function() {
			$("[data-status]").not("[data-status=imagem]").text("...");
			$("[data-status=imagem]").css({opacity: "0.5"});
			loadUtils("status.php", {url: $("[data-player]").data("ip"), shoutcast: $("[data-player]").data("shoutcast")}).done(function(data) {
				$.each(data, function(key, value) {
					$("[data-status="+key+"]").text(value);
					if (key == "dj") $("[data-status=imagem]").css("backgroundImage", "url(https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=gif&user="+value+"&action=&direction=2&head_direction=3&img_format=png&gesture=sml&headonly=0&size=l)").css({opacity: "1"});
				});
			});
		},
		pause: function() {
			$("#hplayer", "body").html("");
			player.refresh();
		},
		play: function() {
			var audio = $("<audio>");
			audio.attr("id", "haudio");
			audio.attr("src", "http://" + $("[data-player]").data("ip") + "/;stream.aacp");
			audio.attr("type", "audio/mp4");
			$("#hplayer", "body").html(audio);
			var hplayer = document.getElementById("haudio");
			hplayer.volume = 1;
			hplayer.play();
			$("body").off("click", "[data-status]:not([data-status=imagem])").on("click", "[data-status]:not([data-status=imagem])", function() {
				player.refresh();
			});
			player.refresh();
		}
	};
	$("body").off("click", "[data-player]").on("click", "[data-player]", function() {
		if (clickedFirst != 0) {
			switch($(this).data("player")) {
				case "pause":
					player.pause();
					$("[data-player]", "body").data("player", "play").removeClass("pause");
					break;
				case "play":
					player.play();
					$("[data-player]", "body").data("player", "pause").addClass("pause");
					break;
			}
		}
	});
	player.refresh();
	var playerInterval = setInterval(function() {
		player.refresh();
	}, 60000);
	$("body").on("click", function() {
		if (clickedFirst == 0) {
			clickedFirst = 1;
			player.play();
			$("[data-player]", "body").data("player", "pause").addClass("pause");
		}
	});
});