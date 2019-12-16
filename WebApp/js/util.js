/* This function checks if internet is available or not*/
function checkInternet() {
    online = window.navigator.onLine;
    return online;
}

/* This function deletes Logs file from SD Card*/
function deleteFileFromSDCard(comingFrom) {
    var sdcard = navigator.getDeviceStorage('sdcard');

    var request = sdcard.delete(CONST_LOGS_FILE_NAME);

    request.onsuccess = function() {
        console.log("File deleted");
        if (comingFrom == CONST_CLEAR_LOGS) {
            alert(CONST_LOGS_CLEARED);
        }
    }

    request.onerror = function() {
        console.log("Unable to delete the file: " + this.error);
    }
}

/* This function creates Logs file in SD Card*/
function createBlankFileInSDCard() {
    var sdcard = navigator.getDeviceStorages("sdcard");
    var file = new Blob([], { type: "text/plain" });
    var request = sdcard[0].addNamed(file, CONST_LOGS_FILE_NAME);

    request.onsuccess = function() {
        var name = this.result;
        console.log("Blank File" + name + "successfully created");
    }
    request.onerror = function(error) {
        console.log("Error occured while creating Blank File");
    }
}

/* This function writes Logs to SD Card.
contentToWrite: is the text to be written to file*/
function writeFileToSDCard(contentToWrite) {
    var sdcard = navigator.getDeviceStorages("sdcard");
    var file = new Blob([contentToWrite], { type: "text/plain" });
    var request = sdcard[0].addNamed(file, CONST_LOGS_FILE_NAME);

    request.onsuccess = function() {
        var name = this.result;
        console.log("File" + name + '" successfully wrote on the sdcard storage area');
    }
    request.onerror = function(error) {
        console.warn("Unable to write the file: " + JSON.stringify(error));
    }
}

/* This function reads and writes Logs to SD Card.
contentToWrite: is the text to be written to file*/
function readFileFromSDCard(contentToWrite) {
    var sdcard = navigator.getDeviceStorage('sdcard');

    var request = sdcard.getEditable(CONST_LOGS_FILE_NAME);

    request.onsuccess = function() {
        var file = this.result;
        console.log("File Exists, Reading the File Now " + file.name);
        var reader = new FileReader();
        reader.addEventListener("loadend", function() {
            var contentFromSDCard = reader.result;
            console.log("ContentFromSDCard " + contentFromSDCard);
            if (contentToWrite == CONST_SHOW_LOGS) {
                $("#root").append(contentFromSDCard);
            } else {
                deleteFileFromSDCard('');
                var finalContentToWrite;
                if (contentToWrite != "") {
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var dateTime = date + ' ' + time;
                    finalContentToWrite = dateTime + "<br />" + contentToWrite + "<br />" + contentFromSDCard + "<br />";
                } else {
                    finalContentToWrite = contentToWrite + "<br />" + contentFromSDCard + "<br />";
                }
                console.log("finalContentToWrite " + finalContentToWrite);
                writeFileToSDCard(finalContentToWrite);
            }
        });
        reader.readAsText(file);
    }
    request.onerror = function(error) {
        if (error.name = 'NotFoundError') {
            console.warn("NotFoundError");
            writeFileToSDCard("");
        } else {
            console.warn("NotFoundError Else");
        }
    }
}
//Access File System