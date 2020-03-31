// function missionCheck(){
// 	var formMission = $("#misson_check"),
// 		formMessage = $("#send_message");
//
// 	formMessage.hide();
//
// 	formMission.submit(function(event){
// 		var request = $.ajax({
// 			method: "GET",
// 			url: "missionCheckScript",
// 			data: {}
// 		});
//
// 		request.done(function(msg){
// 			$(this).addClass("animated bounceOutUp");
// 			$(this).fadeOut(300);
// 			formMessage.fadeIn(300);
// 			formMessage.addClass("animated bounceInUp");
// 		});
//
// 		request.fail(function(msg){
// 			$(this).addClass("animated shake");
// 		})
//
// 		event.preventDefault();
// 	});
// }
//
// function sendMessage(){
// 	var formMessage = $("#send_message");
//
// 	formMessage.submit(function(event){
// 		var request = $.ajax({
// 			method: "POST",
// 			url: "sendMessageScript",
// 			data: {}
// 		});
//
// 		request.done(function(msg){
// 		});
//
// 		request.fail(function(msg){
// 			$(this).addClass("animated shake");
// 		})
//
// 		event.preventDefault();
// 	});
// }

function loadUtils(type, extradata) {
	return $.ajax({
		url: "https://api.mateusmelo.com/" + type,
		type: "GET",
		data: extradata
	});
}

function divEffects(){
	var player = $("#player");
	var logo = $("#logo");
	var chat_title = $("#chat .title");
	var title_square = $("#chat #messages");
	var develp = $(".development");
	var interview = $("#interview");

	logo.hide();
	player.hide();
	chat_title.hide();
	title_square.hide();
	develp.hide();

	$("#left-side").addClass(" animated bounceInDown");
	interview.addClass("animated bounceInLeft");


	setTimeout(
		function(){
			develp.fadeIn(1000);
			develp.addClass(" animated heartBeat");
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
	//missionCheck();
	//sendMessage();
	divEffects();
	var isLoading = false;
	var player = {
		refresh: function() {
			$("[data-status]").not("[data-status=imagem]").text("...");
			$("[data-status=imagem]").css({opacity: "0.5"});
			loadUtils("status.php", {url: $("[data-player]").data("ip"), shoutcast: $("[data-player]").data("shoutcast"), security: $("[data-player]").data("security")}).done(function(data) {
				$.each(data, function(key, value) {
					$("[data-status="+key+"]").text(value);
					if (key == "dj") $("[data-status=imagem]").css("backgroundImage", "url(https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=gif&user="+value+"&action=&direction=2&head_direction=3&img_format=png&gesture=sml&headonly=0&size=l)").css({opacity: "1"});
				});
				if (data.dj == "KiHabboVirus") $("[data-status=programa]").text("Quarentena KiHabbo");
			});
		},
		pause: function() {
			$("#hplayer", "body").html("");
			player.refresh();
			$("[data-player]", "body").data("player", "play").removeClass("pause");
		},
		play: function() {
			var audio = $("<audio>");
			audio.attr("id", "haudio");
			var https = "http";
			if ($("[data-player]").data("security") == 1) https = "https";
			audio.attr("src", https + "://" + $("[data-player]").data("ip") + "/;stream.aacp");
			audio.attr("type", "audio/mp3");
			$("#hplayer", "body").html(audio);
			var hplayer = document.getElementById("haudio");
			hplayer.volume = 1;
			var playPromise = hplayer.play();
			if (playPromise !== undefined) {
				playPromise.then(_ => {
					$("[data-player]", "body").data("player", "pause").addClass("pause");
					isLoading = false;
				}).catch(error => {
					isLoading = false;
				});
			}
			$("body").off("click", "[data-status]:not([data-status=imagem])").on("click", "[data-status]:not([data-status=imagem])", function() {
				player.refresh();
			});
			player.refresh();
		}
	};
	$("body").off("click", "[data-player]").on("click", "[data-player]", function() {
		if (clickedFirst != 0 && !isLoading) {
			switch($(this).data("player")) {
				case "pause":
					player.pause();
					break;
				case "play":
					player.play();
					break;
			}
		}
	});
	player.refresh();
	var playerInterval = setInterval(function() {
		player.refresh();
	}, 60000);
	var isPlaying = function () {
		var hplayer = document.getElementById("haudio");
		return hplayer
			&& hplayer.currentTime > 0
			&& !hplayer.paused
			&& !hplayer.ended
			&& hplayer.readyState > 2;
	};
	setInterval(function() {
		var check = isPlaying();
		if (check !== null) {
			if(!isPlaying()) {
				if (isLoading) return false;
				isLoading = true;
				var hplayer = document.getElementById("haudio");
				var https = "http";
				if ($("[data-player]").data("security") == 1) https = "https";
				$(hplayer).attr("src", https + "://" + $("[data-player]").data("ip") + "/;stream.aacp");
				hplayer.load();
				setTimeout(function() {
					var playPromise = hplayer.play();
					if (playPromise !== undefined) {
						playPromise.then(_ => {
							$("[data-player]", "body").data("player", "pause").addClass("pause");
							isLoading = false;
						}).catch(error => {
							isLoading = false;
						});
					}
				}, 1000);
			}
		}
	}, 1000);
	$("body").on("click", function() {
		if (clickedFirst == 0) {
			clickedFirst = 1;
			isLoading = true;
			player.play();
			$("[data-player]", "body").data("player", "pause").addClass("pause");
		}
	});
});