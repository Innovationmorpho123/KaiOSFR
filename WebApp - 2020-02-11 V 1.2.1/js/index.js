var pickReferenceIsPressed;
var fetchingLKMSLicense;
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
            if (fetchingLKMSLicense) {
                cameraValue = e.rangeParent.data;
                openCamera();
            } else {
                alert('Fetching LKMS License!')
            }
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
    initialSetup();
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

function initialSetup() {
    readFileFromSDCard("");
    checkLicensePresent();
}

/* This method invokes License Server API to get License Data for SDK */
function getLicenseFromServer() {
    var lock = navigator.mozSettings.createLock();
    var req_device = lock.get('deviceinfo.hash_id');
    req_device.onsuccess = function() {
        var deviceID;
        deviceID = req_device.result['deviceinfo.hash_id'];
        console.log('deviceID!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' + deviceID);

        var data = { profileId: 'JIOSIT', appId: 'com.jio.android.attendancefr', deviceId: deviceID };

        var postData = {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'apiKey': 'QaWxhKg64aa3w+CuJwh7zMRZ3zmUHx1JZTSsL19jvsQ='
            }
        }

        fetch('https://frdevicessit.jio.com:8443/lkms-server-app/v3/licenses', postData)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('License Data !!!!!!!!!!!!!!!', responseJson.data);
                createLicenseFileOnSDCard(responseJson.data);
                fetchingLKMSLicense = true;
                alert('License Fetched!');
            })
            .catch((error) => {
                console.log('error', error);
            });
    }

    req_device.onerror = function() {
        console.log("collectDeviceSpecificInfo An Lock error occured");
    }
}

/* This method checks if License is already present in the device */
function checkLicensePresent() {
    var sdcard = navigator.getDeviceStorage('sdcard');
    var request = sdcard.getEditable(CONST_LICENSE_FILE_NAME);
    request.onsuccess = function() {
        var file = this.result;
        console.log("License File Exists, Reading the File Now " + file.name);
        var reader = new FileReader();
        reader.addEventListener("loadend", function() {
            var licenseData = reader.result;
            console.log('LicenseData is' + licenseData);
            fetchingLKMSLicense = true;
        });
        reader.readAsText(file);
    }
    request.onerror = function(error) {
        console.log("getLicenseFromServer!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        getLicenseFromServer();
    }
}