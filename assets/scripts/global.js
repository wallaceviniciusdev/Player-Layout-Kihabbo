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

		})

		event.preventDefault();
	});
}

function playButton(){
	var play = $(".play");

	play.click(function(){
		$(this).toggleClass("pause");
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

missionCheck();
sendMessage();
playButton();
divEffects();