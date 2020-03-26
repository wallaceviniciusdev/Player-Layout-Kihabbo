var play = $(".play");

play.click(function(){
	$(this).toggleClass("pause");
});


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