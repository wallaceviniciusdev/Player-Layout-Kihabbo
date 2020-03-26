$(document).ready(function () {
    var clickedFirst = 0;
    $(document).on("click", function() {
        if (clickedFirst == 0) {
            var khplayer = $('#khplayer').contents()[0].getElementById("stream");
            khplayer.volume = 0.4;
            khplayer.play();
        }
        clickedFirst = 1;
    });
});