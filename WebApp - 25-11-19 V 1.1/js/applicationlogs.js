var pickReferenceIsPressed;
window.addEventListener("keydown", keyNavigation);

/* Handle key events */
function keyNavigation(e) {
    if (e.key == "ArrowDown") {
        $(".move:focus").next().focus();
    }
    if (e.key == "ArrowUp") {
        $(".move:focus").prev().focus();
    }
    if (!$(':focus').length) {
        // console.log("No focus set, now focusing back")
        $(".move")[0].focus();
    }
    if ((e.key == "Enter") && $(':focus').length) {
        if (e.rangeParent.data == CONST_SHOW_LOGS) {
            navigateToShowLogsPage();
        } else if (e.rangeParent.data == CONST_CLEAR_LOGS) {
            clearLogs();
        }
    }
    if (e.key == "Backspace") {
        e.preventDefault();
        window.location.href = 'index.html';
    }
}

/* After document ready do auto focus on first element */
$(document).ready(function() {
    $(".move")[0].focus();
});

/* This function clears logs on pressing Clear Logs Button under Application Logs Section.
   deleteFileFromSDCard function is present in util.js file */
function clearLogs() {
    deleteFileFromSDCard(CONST_CLEAR_LOGS);
}

/* This function takes user to showlogs.html page which shows Logs of services hit and their 
   response or error with timestamp*/
function navigateToShowLogsPage() {
    window.location.href = 'showlogs.html';
}