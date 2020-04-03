$(document).ready(function () {
    var clickedFirst = 0;
    $(document).on("click", function() {
        if (clickedFirst == 0) {
            khplayer = document.getElementById("khplayer");
            khplayer.contentWindow.postMessage(1, "*");
        }
        clickedFirst = 1;
    });
});