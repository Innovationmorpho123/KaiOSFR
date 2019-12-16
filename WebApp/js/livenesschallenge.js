var text = [CONST_MOVE_RIGHT_TEXT, CONST_MOVE_LEFT_TEXT];
var counter = 0;
var elem = document.getElementById("textCenter");
var counterForCurrentPosition = 0;
var firstX, firstY;
var targetZeroAchieved, targetOneAchieved, targetTwoAchieved = false;

var frTest = {
    _which_camera: 1,
    _cameraObj: null,
    _startFr: false,

    /* This function initialises the camera */
    init: function init() {
        this.current = 0;
        window.addEventListener('keyup', this);
        window.addEventListener('keydown', this);
        window.addEventListener('hashchange', this);
        this.view = document.getElementById("cameraview");
        this.cameras = navigator.mozCameras.getListOfCameras();
        navigator.mozCameras.getCamera(this.cameras[this._which_camera])
            .then(this.gotCamera.bind(this), this.gotCameraError.bind(this));
    },

    uninit: function uninit() {

    },

    /* This function returns the most suitable picture size for camera
      sizes: It's an array of picture sizes */
    getProperPictureSize: function getProperPictureSize(sizes) {
        var delta, ratio, gradual = 1,
            index = 0;
        var screenRatio = document.body.clientWidth / document.body.clientHeight;

        // get a picture size that's the largest and mostly eaqual to screen ratio
        for (var i = 0, len = sizes.length; i < len; i++) {
            ratio = sizes[i].height / sizes[i].width;
            if (ratio > 1) {
                ratio = 1 / ratio;
            }
            delta = Math.abs(screenRatio - ratio);
            if (delta < gradual || (delta === gradual &&
                    sizes[index].height * sizes[index].width < sizes[i].height * sizes[i].width)) {
                gradual = delta;
                index = 0; //i;
            }
        }
        return sizes[index];
    },

    /* This function sets camera properties for instance style, camera angle.
       This function gets called when camera is successfully invoked.
       params: an object of camera properties*/
    gotCamera: function gotCamera(params) {
        var camera = this._cameraObj = params.camera;
        var config = {
            previewSize: {
                width: 640,
                height: 480
            },
            pictureSize: frTest.getProperPictureSize(camera.capabilities.pictureSizes)
        };
        camera.setConfiguration(config);

        var style = frTest.view.style;

        var transform = '';
        if (this._which_camera === 1) {
            transform += ' scale(-1, 1)';
        }
        var angle = camera.sensorAngle;
        transform += 'rotate(' + angle + 'deg)';

        style.MozTransform = transform;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        if (angle % 180 === 0) {
            style.top = 0;
            style.left = 0;
            style.width = width + 'px';
            style.height = height + 'px';
        } else {
            style.width = 300 + 'px';
            style.height = 270 + 'px';
            style.marginLeft = -30 + 'px';
        }
        frTest.view.mozSrcObject = camera;
        frTest.view.play();
        frTest.startFaceRecognition();
    },


    gotCameraError: function gotCameraError() {

    },

    /* This function starts SDK as soon as camera opens and returns BestImage and MatchScore 
    when invoked with Reference Image.
    SDK also returns coordinates for CR2D and direction instruction for Slam Liveness challenge*/
    startFaceRecognition: function startFaceRecognition() {

        dump("Click start face recognition button......");
        if (!this._cameraObj) {
            dump("Invalid camera object");
            return;
        }

        this._startFr = true;

        function hexString2byte(str) {
            var a = [];
            for (var i = 0, len = str.length; i < len; i += 2) {
                a.push(parseInt(str.substr(i, 2), 16));
            }
            return new Uint8Array(a);
        }

        let licenseStr = 'b191eb80f5346d37118c56c41507700cbdfea577606cd2955706dcc3475ada77e0b69f3f14f1b1aaaa56394a74495252420a56686b01a255d6f8eef3bb229c5bbe7af2f0f89af76124eb3196942318bab63a02c232cb26ae4b997eb597f9afc07f0d311b7c83305c096eca0865e9b1971127193a4d5f4f9674bd86559b9d13b8';

        let bytes = hexString2byte(licenseStr);
        console.log("license files:" + bytes.buffer);
        var blob = new Blob([bytes.buffer], { type: 'application/octet-stream' });

        this._cameraObj.getFaceAnalysis(blob)
            .then((faceAnalysisManager) => {
                faceAnalysisManager.addEventListener('faceanalysisresults', function(result) {
                    dump("Got analysisResult:" + result.faceAnalysisResults.analysisResult);
                    dump("Got analysisInfo:" + result.faceAnalysisResults.analysisInfo);
                    dump("Got matchScore" + result.faceAnalysisResults.matchScore);

                    //For Slam
                    if (pageLocationSlamLiveness()) {
                        frTest.checkSlamLivenessInfo(result.faceAnalysisResults.analysisInfo);
                    }

                    if (result.faceAnalysisResults.payload) {
                        dump("Got faceanalysisresults payload !" + result.faceAnalysisResults.payload);

                        var reader = new FileReader();
                        reader.onload = function() {
                            var jsonResponse = reader.result;
                            var objects = JSON.parse(jsonResponse);
                            console.log(" contact.challengeInfo  ============" + jsonResponse);
                            if (!pageLocationSlamLiveness()) {
                                showCircles(objects);
                            }
                        }
                        reader.readAsText(result.faceAnalysisResults.payload);
                    } else {
                        dump("Got payload is null");
                    }

                    if (result.faceAnalysisResults.bestImage) {
                        dump("Got faceanalysisresults!" + result.faceAnalysisResults.bestImage.width);
                        dump("Got faceanalysisresults!" + result.faceAnalysisResults.bestImage.height);
                        dump("Got faceanalysisresults!" + result.faceAnalysisResults.bestImage.type);
                        dump("Got faceanalysisresults!" + result.faceAnalysisResults.bestImage.imageData);

                        try {
                            if (result.faceAnalysisResults.bestImage.imageData) {
                                var imageData = result.faceAnalysisResults.bestImage.imageData;
                                var imageReader = new FileReader();
                                imageReader.addEventListener("loadend", function() {
                                    try {
                                        // deleteBestImageFromSDCard();
                                        //
                                        var sdcard = navigator.getDeviceStorage('sdcard');

                                        var requestDelete = sdcard.delete(CONST_BEST_IMAGE_LOCATION);

                                        requestDelete.onsuccess = function() {
                                            console.log("Best Image Deleted");

                                            const typedArray = new Int8Array(imageReader.result);
                                            dump("BestImage length = " + typedArray.length);
                                            dump("BestImage:");
                                            var blob = new Blob([typedArray.buffer], { type: 'image/bmp' });
                                            var storage = navigator.getDeviceStorage('pictures');
                                            var request = storage.addNamed(blob, CONST_SD_CARD + CONST_BEST_IMAGE_LOCATION);

                                            request.onsuccess = function() {
                                                var name = this.result;
                                                console.log("File" + name + '" successfully wrote on the sdcard storage area');
                                                setTimeout(function() { launchMatchResultPage(); }, 1000);
                                            }

                                            function launchMatchResultPage() {
                                                localStorage.setItem("noLivenessImageName", null);
                                                localStorage.setItem("matchScore", result.faceAnalysisResults.matchScore);
                                                localStorage.setItem("livenessImageName", CONST_SD_CARD + CONST_BEST_IMAGE_LOCATION);
                                                window.location.href = 'matchresult.html';
                                            }
                                            request.onerror = function(error) {
                                                console.warn("Unable to write the file: " + JSON.stringify(error));
                                            }

                                        }

                                        requestDelete.onerror = function() {
                                                console.log("Unable to delete the file: " + this.error);
                                            }
                                            //

                                    } catch (e) {
                                        dump("Unable to create array buffer for best image");
                                    }
                                });

                                imageReader.readAsArrayBuffer(imageData);
                            }

                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        dump("Got bestImage is null");
                    }
                });
                dump("Got face analysis manager......");
                this._faceAnalysisManager = faceAnalysisManager;

                var sdcard = navigator.getDeviceStorage('sdcard');
                var request = sdcard.get(localStorage.getItem("referenceImageName"));
                request.onsuccess = function() {
                    var file = this.result;
                    console.log("Get the file: " + file.name);
                    let imageReader = new FileReader();
                    imageReader.onloadend = function(e) {
                        try {
                            let img = new Uint8Array(e.target.result);
                            let blob = new Blob([img], { type: 'application/octet-stream' });
                            let _referenceImage1 = [];
                            let _referenceImage = new FaceAnalysisImage(288, 352, 4, blob);
                            _referenceImage1.push(_referenceImage);
                            if (pageLocationSlamLiveness()) {
                                faceAnalysisManager.startFaceAnalysis(0, _referenceImage1);
                            } else {
                                faceAnalysisManager.startFaceAnalysis(4, _referenceImage1);
                            }
                        } catch (e) {
                            dump("Unable to create array buffer for best image");
                        }
                    };
                    dump("BestImage read as array buffer");
                    imageReader.readAsArrayBuffer(file);
                }
                request.onerror = function() {
                    console.warn("Unable to get the file: " + this.error);
                }
                dump("Start face analysis......");
            })
            .catch(() => {
                dump("Start fr failed");
            });
    },

    /* This function displays direction texts on screen for Slam Liveness*/
    checkSlamLivenessInfo: function checkSlamLivenessInfo(analysisInfo) {
        var showText = ''
        switch (analysisInfo) {
            case SLAM_LIVENESS_INFO.POSITION_INFO_GOOD:
                showText = HEAD_WELL_POSITIONED
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_MOVE_BACK_INTO_FRAME:
                showText = NO_HEAD_DETECTED
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_CENTER_MOVE_BACKWARDS:
                showText = MOVE_AWAY_FROM_THE_CAMERA
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_CENTER_MOVE_FORWARDS:
                showText = MOVE_CLOSER_TO_THE_CAMERA
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_CENTER_TURN_RIGHT:
                showText = TURN_YOUR_HEAD_RIGHT
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_CENTER_TURN_LEFT:
                showText = TURN_YOUR_HEAD_LEFT
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_CENTER_ROTATE_UP:
                showText = TURN_YOUR_HEAD_UP
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_CENTER_ROTATE_DOWN:
                showText = TURN_YOUR_HEAD_DOWN
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_MOVING_TOO_FAST:
                showText = YOU_ARE_MOVING_TOO_FAST
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_CENTER_TILT_RIGHT:
                showText = TILT_YOUR_HEAD_RIGHT
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_CENTER_TILT_LEFT:
                showText = TILT_YOUR_HEAD_LEFT
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_MOVE_DARKER_AREA:
                showText = THE_PLACE_IS_TOO_BRIGHT
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_MOVE_BRIGHTER_AREA:
                showText = THE_PLACE_IS_TOO_DARK
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_STAND_STILL:
                showText = STAND_STILL
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_OPEN_EYES:
                showText = OPEN_YOUR_EYES
                break;
            case SLAM_LIVENESS_INFO.POSITION_INFO_UNKNOWN:
                showText = POSITION_INFO_UNKNOWN
                break;
        }

        elem.innerHTML = showText;

    },

    get navigableItems() {
        delete this.navigableItems;
        return this.navigableItems = document.querySelectorAll('.navigable');
    },

    /* Handle events */
    handleEvent: function handleEvent(ev) {
        switch (ev.type) {
            case 'click':
                if (ev.target.id === "exit-button") {
                    window.location.hash = '';
                }
                break;
            case 'load':
                break;
            case 'unload':
                break;
            case 'hashchange':
                break;
            case 'transitionend':
                break;
            case 'keydown':
                this.handleKeydown(ev);
                break;
            case 'keyup':
                this.handleKeyup(ev);
                break;
        }
    },

    disSelectAll: function() {
        this.sendMoney.checked = false;
        this.getMoney.checked = false;
        this.stop.checked = false;
    },

    /* This function handles key events */
    handleKeydown: function ut_handleKeydown(ev) {
        var key = ev.key;
        switch (key) {
            case 'Enter':
                if (ev.target.id == "startfr-button") {

                } else if (ev.target.id == "stopfr-button") {
                    dump("Stop face recognition......");
                    if (!this._startFr) {
                        dump("Fr is stopped");
                        return;
                    }
                    this._startFr = false;
                    this._faceAnalysisManager.stopFaceAnalysis();
                }
                break;
            case 'ArrowUp':
                this.current -= 1;
                if (this.current < 0) {
                    this.current = this.navigableItems.length;
                }
                for (let i = 0; i < this.navigableItems.length; i++) {
                    this.navigableItems[i].style.backgroundColor = "";
                }
                this.navigableItems[this.current].focus();
                this.navigableItems[this.current].style.backgroundColor = "red";
                break;
            case 'ArrowDown':
                this.current += 1;
                this.current %= this.navigableItems.length;
                this.navigableItems[this.current].focus();
                for (let i = 0; i < this.navigableItems.length; i++) {
                    this.navigableItems[i].style.backgroundColor = "";
                }
                this.navigableItems[this.current].style.backgroundColor = "red";
                break;
            case 'BrowserBack':
            case 'Backspace':
                break;
        }
    },

    /* This function handles key events */
    handleKeyup: function ut_handleKeyup(ev) {
        var key = ev.key;
        switch (key) {
            case 'BrowserBack':
            case 'Backspace':
                break;
        }
    }
};

function change() {
    elem.innerHTML = text[counter];
    counter++;
    if (counter >= text.length) {
        counter = 0;
        // clearInterval(inst); // uncomment this if you want to stop refreshing after one cycle
    }
}
/* Handle keydown events */
window.addEventListener("keydown", keyNavigation);

/* This function handles key events */
function keyNavigation(e) {
    if (e.key == "Backspace") {
        e.preventDefault(); // to prevent app from exiting
        window.location.href = 'index.html';
    }

}

/* This is called when page loads */
window.addEventListener('load', frTest.init.bind(frTest));

/* This function shows circles on screen for CR2D challenge */
function showCircles(json) {
    var info = json.challengeInfo;
    var numberOfTargets = info.numTargets;
    var currentTarget = info.currentTarget;
    var stability = info.stability;
    var currentX, currentY;
    var polyLine;
    if (info.current_x > 0) {
        if (counterForCurrentPosition == 0) {
            firstX = info.current_x;
            firstY = info.current_y;
            counterForCurrentPosition++;
        } else {
            // currentX = 220 - info.current_x;
            currentX = info.current_x;
            currentY = info.current_y;
        }
    }
    var targetZeroX = info.targets[0].target_x;
    var targetZeroY = info.targets[0].target_y;

    var targetOneX = info.targets[1].target_x;
    var targetOneY = info.targets[1].target_y;

    var targetTwoX = info.targets[2].target_x;
    var targetTwoY = info.targets[2].target_y;

    let svgElement = document.getElementById("svgEle");
    svgElement.innerHTML = "";
    if (numberOfTargets > 0) {
        if (targetZeroAchieved) {
            svgElement.insertAdjacentHTML('beforeend', "<circle id= 1 cx=" + targetZeroX + "px cy =" + targetZeroY + "px r=20 fill=red></circle>");
        } else {
            svgElement.insertAdjacentHTML('beforeend', "<circle id= 1 cx=" + targetZeroX + "px cy =" + targetZeroY + "px r=20 fill=blue></circle>");
        }
        svgElement.insertAdjacentHTML('beforeend', "<text id= 1 x=" + targetZeroX + "px y =" + targetZeroY + "px fill=green style='font-size: 12px' > 1 </text>");
        if (numberOfTargets > 1) {
            if (targetOneAchieved) {
                svgElement.insertAdjacentHTML('beforeend', "<circle id= 2 cx=" + targetOneX + "px cy =" + targetOneY + "px r=20 fill=red></circle>");
            } else {
                svgElement.insertAdjacentHTML('beforeend', "<circle id= 2 cx=" + targetOneX + "px cy =" + targetOneY + "px r=20 fill=blue></circle>");
            }
            svgElement.insertAdjacentHTML('beforeend', "<text id= 2 x=" + targetOneX + "px y =" + targetOneY + "px fill=green style='font-size: 12px' > 2 </text>");
            if (numberOfTargets > 2) {
                if (targetTwoAchieved) {
                    svgElement.insertAdjacentHTML('beforeend', "<circle id= 3 cx=" + targetTwoX + "px cy =" + targetTwoY + "px r=20 fill=red></circle>");
                } else {
                    svgElement.insertAdjacentHTML('beforeend', "<circle id= 3 cx=" + targetTwoX + "px cy =" + targetTwoY + "px r=20 fill=blue></circle>");
                }
                svgElement.insertAdjacentHTML('beforeend', "<text id= 3 x=" + targetTwoX + "px y =" + targetTwoY + "px fill=green style='font-size: 12px' > 3 </text>");
            }
        }
        svgElement.insertAdjacentHTML('beforeend', "<circle id= 4 cx=" + currentX + "px cy =" + currentY + "px r=20 fill=green></circle>");

        if (currentTarget == 0) {
            if (stability == 100) {
                targetZeroAchieved = true;
            }
            polyLine = "'" + firstX + "," + firstY + spaces(1) + currentX + "," + currentY + "'";
        } else if (currentTarget == 1) {
            if (stability == 100) {
                targetOneAchieved = true;
            }
            polyLine = "'" + targetZeroX + "," + targetZeroY + spaces(1) + currentX + "," + currentY + "'";
        } else if (currentTarget == 2) {
            if (stability == 100) {
                targetTwoAchieved = true;
            }
            polyLine = "'" + targetOneX + "," + targetOneY + spaces(1) + currentX + "," + currentY + "'";
        }
        svgElement.insertAdjacentHTML('beforeend', "<polyline points=" + polyLine + "style='fill:none;stroke:black;stroke-width:3'/>");
    }
}

/* This is a util function for adding space between coordinates.
   x: number of spaces to be added*/
function spaces(x) {
    var res = '';
    while (x--) res += ' ';
    return res;
}

/* This function checks if page location of user is Slam Liveness OR CR2D Liveness.*/
function pageLocationSlamLiveness() {
    var pageLocation = window.location.href;
    return pageLocation.includes("slamliveness");
}

/* This function deletes Best Image stored in SDCard */
function deleteBestImageFromSDCard() {
    var sdcard = navigator.getDeviceStorage('sdcard');

    var request = sdcard.delete(CONST_BEST_IMAGE_LOCATION);

    request.onsuccess = function() {
        console.log("Best Image Deleted");
    }

    request.onerror = function() {
        console.log("Unable to delete the file: " + this.error);
    }
}