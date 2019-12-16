/* Handle keydown events */
window.addEventListener("keydown", keyNavigation);

/* Handle key events */
function keyNavigation(e) {
    if (e.key == "Backspace") {
        e.preventDefault(); // to prevent app from exiting
        window.location.href = 'applicationlogs.html';
    }
}

/* Shows Logs of services hit and their response or error with timestamp in case of online matching.
   readFileFromSDCard method is present in util.js */
window.addEventListener("load", function() {
    console.log("On Load getting called -- showlogs!");
    readFileFromSDCard(CONST_SHOW_LOGS);
});