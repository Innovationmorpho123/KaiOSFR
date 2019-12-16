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
        if (e.rangeParent.data == CONST_PICK_REFERENCE_IMAGE) {
            cameraValue = e.rangeParent.data;
            openCamera();
        } else if (e.rangeParent.data == CONST_NO_LIVENESS) {
            if (pickReferenceIsPressed) {
                cameraValue = e.rangeParent.data;
                navigateToCameraCapturePage();
            } else {
                alert(CONST_PLEASE_PICK_REFERENCE_IMAGE_FIRST);
            }
        } else if (e.rangeParent.data == CONST_SLAM_LIVENESS) {
            if (pickReferenceIsPressed) {
                cameraValue = e.rangeParent.data;
                navigateToSlamLivenessPage();
            } else {
                alert(CONST_PLEASE_PICK_REFERENCE_IMAGE_FIRST);
            }
        } else if (e.rangeParent.data == CONST_CR2D_LIVENESS) {
            if (pickReferenceIsPressed) {
                cameraValue = e.rangeParent.data;
                navigateToCR2DPage()
            } else {
                alert(CONST_PLEASE_PICK_REFERENCE_IMAGE_FIRST);
            }
        } else if (e.rangeParent.data == CONST_APPLICATION_LOGS) {
            navigateToApplicationLogsPage();
        }
    }
}

// After document ready do auto focus on first element
$(document).ready(function() {
    $(".move")[0].focus();
});

/* This is called when page loads.
   readFileFromSDCard is present in util.js
 */
window.addEventListener("load", function() {
    console.log("On Load getting called!");
    readFileFromSDCard("");
});

/* This function opens options (camera and gallery) to pick an image and return blob of the picked image
   in onsuccess callback*/
function openCamera() {

    let activityData = {

        type: ['image/*']

    };

    let activity = new MozActivity({

        name: 'pick',

        data: activityData

    });

    activity.onsuccess = function() {

        let result = activity.result;

        let blob = result.blob; // blob of the selected image

        console.log('testing=' + blob);

        if (cameraValue == CONST_PICK_REFERENCE_IMAGE) {
            pickReferenceIsPressed = true;
            localStorage.setItem("referenceImageName", blob.name);
        } else {
            localStorage.setItem("noLivenessImageName", blob.name);
            window.location.href = 'matchresult.html';
        }
    };

    // Re-throw Gecko-level errors

    activity.onerror = function() {

        console.log('error');

    };
}

/* This function takes user to slamliveness.html page on click of Slam Liveness Button in index.html */
function navigateToSlamLivenessPage() {
    window.location.href = 'slamliveness.html';
}

/* This function takes user to cameracapture.html page on click of No Liveness Button in index.html */
function navigateToCameraCapturePage() {
    window.location.href = 'cameracapture.html';
}

/* This function takes user to applicationlogs.html page on click of Application Logs Button in index.html */
function navigateToApplicationLogsPage() {
    window.location.href = 'applicationlogs.html';
}

/* This function takes user to cr2d.html page on click of CR2D Liveness Button in index.html */
function navigateToCR2DPage() {
    window.location.href = 'cr2d.html';
}