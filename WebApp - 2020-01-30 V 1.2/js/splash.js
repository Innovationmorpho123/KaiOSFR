$(document).ready(function() {
    setTimeout(function() {
        $('#main').ready(function() {
            $('#splash').remove();
            window.location.href = "index.html";
        });
    }, 100);
});