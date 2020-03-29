$(document).ready(function () {

    var inputs = $("#chat #inputs");
    var overlay = $(".overlay");
    $("#chat").hide();
    inputs.hide();

    function overlayStatus(msg) {
        overlay.find("#statusmsg").text(msg);
        overlay.show();
        overlay.addClass("animated bounceInUp");
        setTimeout(function() {
            overlay.removeClass("animated bounceInUp");
        }, 2000);
    }

    function disableChat() {
        $("#username").val("");
        $("#userform").addClass("col-md-12");
        $("#chat").removeClass("animated bounceInUp");
        $("#chat").addClass("animated bounceOutUp");
        setTimeout(
        function(){
            inputs.addClass("animated bounceOutUp");
            inputs.fadeOut(100);
            inputs.removeClass("animated bounceOutUp");
        }, 300);
    }

    function enableForm(form) {
        setTimeout(
        function(){
            inputs.show();
            inputs.find("form").not(form).hide();
            inputs.find(form).fadeIn(100);
            inputs.find(form).addClass("animated bounceInDown");
            setTimeout(function() {
                inputs.find(form).removeClass("animated bounceInDown");
            }, 2000);
        }, 300);
    }

    var attempts = 0;

    var chat = io("//api.mateusmelo.com", {
        path: "/khchat",
        reconnectionAttempts: 5,
        reconnectionDelay: 10000
    });

    var session = {
        username: "",
        token: "",
        ts: 0
    };

    var loggedIn = false;

    var cooldown = false;

    chat.off("connect").on("connect", function() {
        attempts = 0;
        overlay.addClass("animated bounceOutDown");
        $("#chat").removeClass("animated bounceOutUp");
        $("#chat").show();
        $("#chat").addClass("animated bounceInUp");
        setTimeout(function() {
            overlay.hide();
            overlay.removeClass("animated bounceOutDown");
        }, 2000);
        function login() {
            session = {
                username: "",
                token: "",
                ts: 0
            };
            $("#username").val("");
            $("#userform").addClass("col-md-12");
            $("#missionform").hide();
            enableForm("#mission_check");
            $("input[name=username]").off("keyup").on("keyup", function() {
                chat.emit("mission", $(this).val());
            });
            chat.off("mission").on("mission", function(mission) {
                if(mission.length == 0) {
                    $("#missionform").removeClass("animated bounceInUp");
                    $("#missionform").addClass("animated bounceOutUp");
                    setTimeout(
                        function(){
                            $("#userform").addClass("col-md-12");
                            $("#missionform").hide();
                            $("#missionform").removeClass("animated bounceOutUp");
                        }, 300);
                } else {
                    $("#mission").html(mission);
                    if ($("#missionform").is(":hidden")) {
                        $("#userform").removeClass("col-md-12");
                        $("#missionform").removeClass("animated bounceOutUp");
                        $("#missionform").addClass("animated bounceInUp");
                        $("#missionform").fadeIn(300);
                        setTimeout(
                            function(){
                                $("#missionform").removeClass("animated bounceInUp");
                            }, 1000);
                    }
                }
                $("#mission_check").off("submit").on("submit", function() {
                    return false;
                });
                $("#check").off("click").on("click", function() {
                    if (cooldown) return false;
                    cooldown = true;
                    $(this).css({opacity: 0.8, cursor: "initial"});
                    chat.emit("missionConfirm");
                });
                chat.off("missionCheck").on("missionCheck", function(check) {
                    if (check.user && check.mission) {
                        session.token = check.token;
                        session.ts = check.ts;
                        session.username = check.username;
                        localStorage.setItem("session", JSON.stringify(session));
                        chat.emit("handshake", JSON.parse(localStorage.getItem("session")));
                        loggedIn = true;
                    } else {
                        if (!check.user) $("input[name=username]").addClass("animated shake");
                        if (!check.mission) $("#missionform").addClass("animated shake");
                        setTimeout(function() {
                            cooldown = false;
                            $("#check").css({opacity: 1, cursor: "pointer"});
                            $("input[name=username]").removeClass("animated shake");
                            $("#missionform").removeClass("animated shake");
                        }, 2000);
                    }
                });
            });
        }
        function logout() {
            localStorage.removeItem("session");
            login();
        }
        if (localStorage.hasOwnProperty("session")) {
            session = JSON.parse(localStorage.getItem("session"));
            if ("username" in session && "token" in session && "ts" in session) {
                chat.emit("handshake", session);
                loggedIn = true;
            } else {
                logout();
            }
        } else {
            login();
        }
        chat.off("logout").on("logout", function() {
            logout();
        });
        var muteInterval;
        var isMuted = false;
        function muted(until) {
            if (isMuted) return;
            var date = new Date();
            date = Math.floor(date.getTime() / 1000);
            until = until - date;
            if (until > 0) {
                isMuted = true;
                $("#send_message").find("button").css({opacity: 0.8, cursor: "initial"});
                muteInterval = setInterval(function() {
                    until--;
                    var plural = "s";
                    if (until == 1) plural = "";
                    $("#send_message").find("input[name=msg]").val("");
                    $("#send_message").find("input[name=msg]").attr("disabled", 1).attr("placeholder", "Flood detectado. Volte a falar em "+until+" segundo"+plural+".");
                    if (until == 0) {
                        isMuted = false;
                        $("#send_message").find("button").css({opacity: 1, cursor: "pointer"});
                        $("#send_message").find("input[name=msg]").removeAttr("disabled").attr("placeholder", "Sua mensagem");
                        clearInterval(muteInterval);
                    }
                }, 1000);
            } else {
                isMuted = false;
                $("#send_message").find("button").css({opacity: 1, cursor: "pointer"});
                $("#send_message").find("input[name=msg]").removeAttr("disabled").attr("placeholder", "Sua mensagem");
            }
        }
        function addMessage(msg) {
            var msgs = $("#messages").find("ul");
            msg.message = msg.message.replace("<", "&#60;");
            msg.message = msg.message.replace(">", "&#62;");
            msg.message = msg.message.replace(/\n/g,"<br>");
            msg.message = msg.message.replace("\"", "&#34;");
            msg.message = msg.message.replace("'", "&#39;");
            var msgTemplate;
            if (msg.username != session.username) {
                msgTemplate = "<li>\n" +
                    "<div class=\"user\">\n" +
                    "<img src=\"https://www.habbo.com.br/habbo-imaging/avatarimage?&user="+msg.username+"&action=&direction=2&head_direction=3&img_format=png&gesture=&headonly=1&size=s\" alt=\"\">\n" +
                    "</div>\n" +
                    "<div class=\"text\">\n" +
                    "<div class=\"autor\">"+msg.username+"</div> \n" +
                    "<span class=\"text\">"+msg.message+"</span>\n" +
                    "</div>\n" +
                    "</li>";
            } else {
                msgTemplate = "<li class=\"mine\">\n" +
                    "<div class=\"user\">\n" +
                    "<img src=\"https://www.habbo.com.br/habbo-imaging/avatarimage?&user="+msg.username+"&action=&direction=2&head_direction=3&img_format=png&gesture=&headonly=1&size=s\" alt=\"\">\n" +
                    "</div>\n" +
                    "<div class=\"text\">\n" +
                    "<span class=\"text\">"+msg.message+"</span>\n" +
                    "</div>\n" +
                    "</li>";
            }
            msgs.append(msgTemplate);
            msgs.scrollTop(msgs[0].scrollHeight);
        }
        chat.off("chat").on("chat", function(data) {
            $("#messages").find("ul").empty();
            $.each(data.history, function(k, msg) {
               addMessage(msg);
            });
            chat.off("message").on("message", function(msg) {
                addMessage(msg);
            });
            if (loggedIn) {
                if ($("#send_message").is(":hidden")) enableForm("#send_message");
                if (localStorage.hasOwnProperty("mutedUntil")) {
                    var mutedUntil = parseInt(localStorage.getItem("mutedUntil"));
                    var date = new Date();
                    date = Math.floor(date.getTime() / 1000);
                    if (mutedUntil > date) {
                        muted(mutedUntil);
                        isMuted = true;
                    } else {
                        isMuted = false;
                        localStorage.removeItem("mutedUntil")
                    }
                }
                $("#send_message").off("submit").on("submit", function (e) {
                    e.preventDefault();
                    if (isMuted) return false;
                    var input = $(this).find("input[name=msg]");
                    if (input.val().trim()) {
                        addMessage({username: session.username, message: input.val()});
                        chat.emit("message", input.val());
                    }
                    input.val("");
                });
            }
        });
        chat.off("muted").on("muted", function(until) {
            var date = new Date();
            date = Math.floor(date.getTime() / 1000);
            until = date + until;
            muted(until);
            localStorage.setItem("mutedUntil", until.toString());
        });
    });

    chat.off("connect_error").on("connect_error", function(error) {
        attempts = attempts+1;
        overlayStatus("Tentando reconectar ("+attempts+"/5)");
        disableChat();
    });

    chat.off("reconnect_failed").on("reconnect_failed", function() {
        overlayStatus("Falha na conexão, tente novamente mais tarde.");
        disableChat();
    });

});