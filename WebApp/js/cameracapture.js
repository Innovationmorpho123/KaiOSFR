var frTest = {
    _which_camera: 1,
    _cameraObj: null,
    _startFr: false,

    /* This function initialises the camera */
    init: function init() {
        this.current = 0;
        window.addEventListener('keydown', this);
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
                index = i;
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
            style.width = height + height / 3 + 'px';
            style.height = width + 'px';
        }
        frTest.view.mozSrcObject = camera;
        frTest.view.play();

        //Take pictures pemission to save it later in sd card
        var files = navigator.getDeviceStorage('pictures');
        var cursor = files.enumerate();

    },

    gotCameraError: function gotCameraError() {

    },

    /* Handle key events */
    handleEvent: function handleEvent(ev) {
        switch (ev.type) {
            case 'keydown':
                this.handleKeydown(ev);
                break;
        }
    },

    /* This function handles key events for Enter press and back button press */
    handleKeydown: function ut_handleKeydown(ev) {
        var key = ev.key;
        switch (key) {
            case 'Enter':
                dump("Click start face recognition button......");
                if (!this._cameraObj) {
                    dump("Invalid camera object");
                    return;
                }
                //
                var storage = navigator.getDeviceStorage('pictures');
                var pictureOptions = {
                    rotation: 0,
                    pictureSize: null,
                    fileFormat: null
                }

                function onPictureTaken(blob) {
                    var currentDateTime = new Date().getTime();
                    console.log(currentDateTime);
                    var currentTimestamp = CONST_SD_CARD + CONST_FOLDER_NAME + currentDateTime + ".jpg";
                    storage.addNamed(blob, currentTimestamp);
                    setTimeout(function() { afterDelay(currentTimestamp); }, 1000);
                };

                function afterDelay(currentTimestamp) {
                    localStorage.setItem("livenessImageName", null);
                    localStorage.setItem("noLivenessImageName", currentTimestamp);
                    window.location.href = 'matchresult.html';
                };

                function onPictureError(error) {
                    console.warn(error);
                };

                pictureOptions.pictureSize = this._cameraObj.capabilities.pictureSizes[0];
                pictureOptions.fileFormat = this._cameraObj.capabilities.fileFormats[0];
                this._cameraObj.takePicture(pictureOptions).then(onPictureTaken, onPictureError);
                break;
            case 'BrowserBack':
            case 'Backspace':
                window.location.href = 'index.html';
                break;
        }
    },

};


/* This is called when page loads */
window.addEventListener('load', frTest.init.bind(frTest));