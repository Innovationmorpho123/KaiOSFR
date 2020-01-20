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

        let licenseStr = '010c084d53435f434f5245000100d1e1ea67eb21751671e5cc764ad317e595f9cd8d5047e5d6cde7620d0663b7a5a62b451adfa766eba05beb2f32017b1e620f4338f6de5b7efab6e2c213e62e50239764a7b6c12672f46ece89efac97ec603f4e17f18c9d84ce7e9f916756e292221bd91249512908f780983751e1aff64c005effd081134fe0007a7dd52622610b42ba4538f56ece623051fe6fa0889e22dc6e6c50cfd03073ca83b4303240dd134263fb8f16c6d4457242e67d40f454234f9e9154b72aa9edc87abbb2c5e2ac5b7b0398661c5e80ddb94dce95922fab591e5b1b23c69bc55404721797a95b6bef9758937538f027d17c639ba9a42a1e3725644f5d506bd5fca5fc53f36fe7a001100c4d53435f4c4956454e4553530001001c25f33347b0e31ebd001888873dde2ea38c82c73d4206c3582f8cba91d57761fa59e199dd4aa62814aa3f86e025efb6668bc886330fb01ccb9eacf1f9d01967e9e64e623b45789f5600395b2fa27299bebd93bb1de8b40f4727817f3cc1f475fc409930c629523d4911bf8dc381176674b25073936f45ae8fbb3901f25f8a52bf7e71611f04cce82a620f8bdf228673d3c62d5cfe446ad3426b40e4f402b9dbd17f25bb69e345543470208c3de28300ba1651b5eebaab7385eebea71f3cf84a8ed8c1f03bd3e9f85bf111aaac9f10c86b6069354143443c01a9b1f5684a0c07e50752372506970dc0280225a3cea757aba6dbef98319b1ba42207155a3543920109055645524946000100040f0b250394c6720a8d2956fe2139d7938ab98d1dd52393ec657b21b268c451756cadb33d28a131d575fff8bfb1492640f258fb6905e2a96c4713b37949724f97d862823f4d052c34008e7dc080bca83c9bc669441004b99ef247da99f4d40427a9fa30fc78f752f1e71e81edef26dddb29551183f2da5d1a58e5f407e586a3a4fcf83ef062215d5dde15d895ad09f83a1ade3662ae359a4344558a981a98608a9b6b8ac3df54bf1fc7e6d6f19ac0f386b2f09393d35db04dd087218c8a2c67c36b9dd3b46dfef1d4105ada2c701c367ac75b8dfd35b619eb5d129911a8da18d69d1b0c581f6a553239d8ec794790de862e2c2da3338d3a59ec1133acd586860109054944454e54000100400ec86bc7f11650ee0e8394416ff2d0f5e829cbd183d2bf87950aa2f50363d88bfc11d9695f2c2206a3b47dd29ce982c2cdae855858c9cc0459bdfb93d69ff3316197cd6e36b9b7494703ebc5bd91803ac8ec06ed44497fb33464068ba3a20f3ac032dc5c2b1d67071982ac234b5edeef3ec233b754977c1de23d83c244b8c2043f05a59e3406ee08201e0baaf60aa9892607c6db250b2b9ecf3b74236ef612e3631684927291cac91b9479ad277ac283d56cce259cc8b4fd8516dfaedf03da1970037c1071d36fcc4d304c4526b2da4a4d5fce5d2ba1a8658f6df69ce4e95aa5834a6bd1a3e7da0b331637e831df9a7c2cf6b52b7f0f95b76f489772ebdc21010e0a4d4f5250484f46414353000100b11ae32b3001c4c4acd747b8ac56084c5c90230dccb9fbb23ac2893fe7d223bd04eaed31661ae30c3a9702e61cbe2107f750d77034ca43fbf56c5b1383cde066ba767105acb7260df46b886cffce8190ebb7d00901e89f52ec0c94d0e33cea8ce24207e62904e89c8ada9a019c76cb33892b3b7e3ef93a56c76024b1a658a224314c9c598699526d302f0988cfd31cc0481f064f569a31185547a1895b066081a1c029fdca722e585acbf0faea09490bc7dcde524ce136949256614faa0c0e3d5c8edaefca6da12d63f29d041f4f4074be537c6e5ea2ea76b6c88b8f8b1899c942e4867b028eb85122e270b8c57fd0e90729928eaa3c37a48ab936b47c30d1b704c9045835303904c2308204be308202a6a00302010202040a72f3b2300d06092a864886f70d01010b05003050310b3009060355040613024652312a3028060355040a0c214944454d4941204944454e544954592026205345435552495459204652414e4345311530130603550403130c4c4b4d5320526f6f74204341301e170d3139313230393134333530375a170d3230313230383134333530375a3061310b300906035504061302465231233021060355040a0c1a4944454d4941204944454e544954592026205345435552495459312d302b060355040313244c4b4d53206c6963656e7365206365727420666f722070726f66696c65204a494f53495430820122300d06092a864886f70d01010105000382010f003082010a0282010100e3172c997ddafded13bb7801975a92649e49b2cbb5e17974ae6b88565dd7cac3832bb5caaa653c825d23704a4cbf33239d9e6accb90931ec085f7d71fc02ee6effda125f48910d2adcb226605d36a4b1d2732023acb7b929f03cccbbc1b03aec34793db93b8fedf790e4886af98852629bd0f5f55f0563036588adcdced3337265f29d6c672cf495d6ae756d23eea420543c79e8b272dd78e0fe29b68ab57a81342b5e2279fe9586aef614d6a55cb0367303dc375d42d491c6072b8f42365d3d339edaa6a3c678cf0b387c266ee90c964d75487d503d85846d9e5969e091d1d552ed68431b1f8970ba1c056b11bb36f8210f80aff167574c073f50107b7b9c1f0203010001a3818e30818b304906092b060104019c686301043c043a5349542e6a696f6672746573747c636f6d2e6a696f2e616e64726f69642e617474656e64616e636566727c66722e6a696f70686f6e652e636f6d301f0603551d2304183016801454f80f19e9f0f0ce7da4735a9d4942735b1d69b3301d0603551d0e04160414ec61046686b85f5948db929317ded6c42b3c3032300d06092a864886f70d01010b0500038202010023eaa12e0d04661bc29e536aae6949288b3c8b2b121ff436bc0bce1df837cd12851e388d4b6e9f62d99d37c1d53013da8bb1fca509fdbf087630bee91320e7612ec334aeba766e34bf4f46b397455ceb4a802221d20be7fa9e2e954e6b9a14767184ce1857da0694b857eb8f4852e9c2cf128fd76a33caeb80d5de6839c87d2bead8df3285cb633ffef7db5bb7a18132d6e206d2ca0e8081dfb915352f4f6842f54626e56f4108c33a7d14a0b24177d09e26c3227aab4298855e9e89478a8824117c7a38f0a5fceb64756f0acae25def321f6ffd19b615b7267da675c13ebcd37a3c5c71eb1df4e988cf7b475070fa95047b2f6ad055d3d27d94c104d86e1d85cfbab8f36b15465e3c6084eb3e95d935de1febf7ff34193eb691fc42012c7449ec0d3b2942edf7319244ffcd26ddc32ca1cea928373590428715bf2be828f3e0a3d562b4a947dcba3f0aa6ef1f5c76ec643a88c4db20f96821b478ea4cf1c0d1e4e663618aef889d0aeb9975e740b3ca0b5085955d26705002c00b69d411b83b6a53c70861e72733e417bc545e3cc91b289b07cb623af8aed09f5a48ca94371ad58b387fd10862755b36a36c6f991197872290ff26c6390513b68251cba54ddc09b716d9e07782eda2d49b35a2d6f6ffa55e50fafb4fd903986b489abecb1a1c549d93054a2833d5d59b5e2047c88f4976207acf711fa5d73a559198943b71df';

        let bytes = hexString2byte(licenseStr);
        console.log("license files:" + bytes.buffer);
        var blob = new Blob([bytes.buffer], { type: 'application/octet-stream' });

        this._cameraObj.getFaceAnalysis(blob)
            .then((faceAnalysisManager) => {
                faceAnalysisManager.addEventListener('faceanalysisresults', function (result) {
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
                        reader.onload = function () {
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
                                imageReader.addEventListener("loadend", function () {
                                    try {
                                        // deleteBestImageFromSDCard();
                                        //
                                        var sdcard = navigator.getDeviceStorage('sdcard');

                                        var requestDelete = sdcard.delete(CONST_BEST_IMAGE_LOCATION);

                                        requestDelete.onsuccess = function () {
                                            console.log("Best Image Deleted");

                                            const typedArray = new Int8Array(imageReader.result);
                                            dump("BestImage length = " + typedArray.length);
                                            dump("BestImage:");
                                            var blob = new Blob([typedArray.buffer], { type: 'image/bmp' });
                                            var storage = navigator.getDeviceStorage('pictures');
                                            var request = storage.addNamed(blob, CONST_SD_CARD + CONST_BEST_IMAGE_LOCATION);

                                            request.onsuccess = function () {
                                                var name = this.result;
                                                console.log("File" + name + '" successfully wrote on the sdcard storage area');
                                                setTimeout(function () { launchMatchResultPage(); }, 1000);
                                            }

                                            function launchMatchResultPage() {
                                                localStorage.setItem("noLivenessImageName", null);
                                                localStorage.setItem("matchScore", result.faceAnalysisResults.matchScore);
                                                localStorage.setItem("livenessImageName", CONST_SD_CARD + CONST_BEST_IMAGE_LOCATION);
                                                window.location.href = 'matchresult.html';
                                            }
                                            request.onerror = function (error) {
                                                console.warn("Unable to write the file: " + JSON.stringify(error));
                                            }

                                        }

                                        requestDelete.onerror = function () {
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
                request.onsuccess = function () {
                    var file = this.result;
                    console.log("Get the file: " + file.name);
                    let imageReader = new FileReader();
                    imageReader.onloadend = function (e) {
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
                request.onerror = function () {
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

    disSelectAll: function () {
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

    request.onsuccess = function () {
        console.log("Best Image Deleted");
    }

    request.onerror = function () {
        console.log("Unable to delete the file: " + this.error);
    }
}