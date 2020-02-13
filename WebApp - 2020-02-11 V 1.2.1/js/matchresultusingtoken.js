var fileReferenceImage;
var fileNoLivenessImage;
var tokenAuthorisation;

/* Handle keydown events */
window.addEventListener("keydown", keyNavigation);

/* Handle key events */
function keyNavigation(e) {
    if (e.key == "Backspace") {
        e.preventDefault(); // to prevent app from exiting
        // window.history.back();
        window.location.href = 'index.html';
    }

    if ((e.key == "Enter")) {
        // loadImages();
    }

}

/* This is called when page is loaded */
window.addEventListener("load", function() {
    console.log("On Load getting called for matchresult!");
    loadImages();
});

/* This function sets Reference and Captured images along with match score in HTML*/
function loadImages() {
    let referenceImageName = localStorage.getItem("referenceImageName");

    let noLivenessImageName = localStorage.getItem("noLivenessImageName");

    let livenessImageName = localStorage.getItem("livenessImageName");

    var files = navigator.getDeviceStorage('pictures');

    var cursor = files.enumerate();

    cursor.onsuccess = function() {
        var file = this.result;
        if (file != null) {
            if (file.name == referenceImageName) {
                // console.log(' referenceImageName ---- ' + file.name + ' -- ' + referenceImageName);
                fileReferenceImage = file;
                var imageElement = $('<img height="100" width="100">');
                imageElement.attr('src', window.URL.createObjectURL(file));
                imageElement.appendTo("#referenceImage");
            }

            if (file.name == noLivenessImageName || file.name == livenessImageName) {
                // console.log(' livenessImageName ---- ' + file.name + ' -- ' + livenessImageName);
                var imageElement = $('<img height="100" width="100">');
                imageElement.attr('src', window.URL.createObjectURL(file));
                imageElement.appendTo("#noLivenessImage");
                if (livenessImageName != null) {
                    if (!livenessImageName.includes("null")) {
                        let matchScore = localStorage.getItem("matchScore");
                        showMatchingScoreOnScreen(matchScore);
                    } else {
                        goForOnlineMatching(file);
                    }
                } else {
                    goForOnlineMatching(file);
                }
            }
            this.done = false;
        } else {
            this.done = true;
        }
        if (!this.done) {
            this.continue();
        }
    }
}

/* This method invokes WebBio Server API for online matching of Reference and Captured Image.
file: file is captured image to be passed to WebBio Server */
function goForOnlineMatching(file) {
    fileNoLivenessImage = file;
    if (checkInternet()) {
        hitMonitorService();
    } else {
        $('.loader').remove();
        alert(CONST_INTERNET_NOT_AVAILABLE);
    }
}

/* Utility method for showing alerts.
data: Message to be shown */
function alertMethod(data) {
    alert(data);
}

/* This method invokes WebBio Server API to check if server is up and running */
function hitMonitorService() {
    // Send data using API
    readFileFromSDCard('Request: ' + BASE_URL + MONITOR_API);
    var URL = BASE_URL + MONITOR_API;
    fetch(URL, {
            method: 'GET'
        }).then((res) => res.json())
        .then((data) => {
            readFileFromSDCard('Response: OK');
            setTimeout(function() { hitTokenService(); }, 100);
            console.log(data);
        })
        .catch((err) => {
            $('.loader').remove();
            readFileFromSDCard('Response: ' + CONST_SERVER_DOWN);
            alertMethod(CONST_SERVER_DOWN);
            console.log("Error in hitMonitorService");
        })
}

/* This method invokes WebBio Server API to check if server is up and running */
function hitTokenService() {
    // Send data using API
    var formBody = [];
    var details = {
        'client_id': CONST_CLIENT_ID,
        'client_secret': CONST_CLIENT_SECRET
    };
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    //build payload packet
    var postData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody.join('&')
    }
    readFileFromSDCard('Request: ' + BASE_URL_FOR_TOKEN + TOKEN_API + "</br>");
    fetch(BASE_URL_FOR_TOKEN + TOKEN_API, postData)
        .then((response) => response.json())
        .then((responseJson) => {
            console.log('responseJson', responseJson);
            tokenAuthorisation = responseJson.token;
            setTimeout(function() { hitDirectMatchImagesService(); }, 100);
        })
        .catch((error) => {
            $('.loader').remove();
            readFileFromSDCard('Response: ' + CONST_SERVER_DOWN);
            alertMethod(CONST_SERVER_DOWN);
            console.log('error', error);
        });
}

/* This method invokes WebBio Server API to get matching score for the Reference and Captured image passed */
function hitDirectMatchImagesService() {
    const data = new FormData();
    data.append('candidateImage', fileNoLivenessImage);
    data.append('referenceImage', fileReferenceImage);
    data.append('referenceImageType', CONST_IMAGE_TYPE);
    data.append('candidateImageType', CONST_IMAGE_TYPE);
    data.append('correlationId', CONST_CORRELATION_ID);

    //build payload packet
    var postData = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + tokenAuthorisation
        },
        body: data,
    }
    readFileFromSDCard('Request: ' + BASE_URL + MATCH_IMAGES_API + "</br>");
    fetch(BASE_URL + MATCH_IMAGES_API, postData)
        .then((response) => response.json())
        .then((responseJson) => {
            console.log('responseJson', responseJson);
            readFileFromSDCard('Response: ' + "Reference Id: " + responseJson.reference.id + "</br>" +
                "Reference Quality: " + responseJson.reference.quality + "</br>" +
                "Candidate Id: " + responseJson.candidate.id + "</br>" +
                "Candidate Quality: " + responseJson.candidate.quality + "</br>" +
                "Score: " + responseJson.score
            );
            showMatchingScoreOnScreen(responseJson.score);
        })
        .catch((error) => {
            $('.loader').remove();
            readFileFromSDCard('Response: ' + CONST_SERVER_DOWN);
            alertMethod(CONST_SERVER_DOWN);
            console.log('error', error);
        });
}

/* This method shows result passed/failed along with match score.
   matchScore : score obtained after image matching*/
function showMatchingScoreOnScreen(matchScore) {
    $('.loader').remove();
    document.getElementById("MatchScoreTextId").innerHTML = "Match Score : " + Math.round(matchScore);
    if (matchScore > 3000) {
        document.getElementById("SuccessResultTextId").style.display = 'block';
        document.getElementById("SuccessResultTextId").style.marginLeft = "auto";
        document.getElementById("FailedResultTextId").style.display = 'none';
    } else {
        document.getElementById("FailedResultTextId").style.display = 'block';
        document.getElementById("FailedResultTextId").style.marginLeft = "auto";
        document.getElementById("SuccessResultTextId").style.display = 'none';
    }
    localStorage.setItem("referenceImageName", null);
    localStorage.setItem("noLivenessImageName", null);
    localStorage.setItem("livenessImageName", null);
    localStorage.setItem("matchScore", null);
}