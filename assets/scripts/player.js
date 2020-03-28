$(document).ready(function () {
    var clickedFirst = 0;
    var isLoading;
    $(document).on("click", function() {
        if (clickedFirst == 0) {
            isLoading = true;
            var khplayer = $('#khplayer').contents()[0].getElementById("stream");
            khplayer.volume = 0.4;
            var src = $(khplayer).attr("src");
            var playPromise = khplayer.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    var isPlaying = function () {
                        return khplayer
                            && khplayer.currentTime > 0
                            && !khplayer.paused
                            && !khplayer.ended
                            && khplayer.readyState > 2;
                    };
                    setInterval(function() {
                        var check = isPlaying();
                        if (check !== null) {
                            if(!isPlaying()) {
                                if (isLoading) return false;
                                isLoading = true;
                                $(khplayer).attr("src", src);
                                khplayer.load();
                                setTimeout(function() {
                                    var playPromise = khplayer.play();
                                    if (playPromise !== undefined) {
                                        playPromise.then(_ => {
                                            isLoading = false;
                                        }).catch(error => {
                                            isLoading = false;
                                        });
                                    }
                                }, 1000);
                            }
                        }
                    }, 1000);
                    isLoading = false;
                }).catch(error => {
                    isLoading = false;
                });
            }
        }
        clickedFirst = 1;
    });
});