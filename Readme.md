# MobiFace (Development binary)

1. The repo contains 2 zipped folders
  * MobiFace SDK - 2020-02-11 V 1.3.2
  * WebApp - 2020-02-11 V 1.2

2. MobiFace SDK - 2020-02-11 V 1.3.2
  * Contains the SDK binaries along with the dependencies
  * The main Service is in MobiFaceService
  * libFrService.so calls functions inside of the service

3. WebApp - 2020-02-11 V 1.2
  * Contains the Web App Sample App used to run the SDK.
  * Use KaiOS IDE to install the Web App onto the device (https://developer.kaiostech.com/getting-started/env-setup/simulator)

## Integration

1. Create and put the files from MobiFace SDK *2020-01-30 V 1.3.2* inside */system/bin/MobiFace/* of device except the *libFrService.so* and *libgnustl_shared.so* 
2. Put *libFrService.so* and *libgnustl_shared.so* inside */system/lib/* folder of device
3. Create a folder */data/MobiFace* and give the folder permission to all user and groups and others using `chmod 777 /data/MobiFace` (required for license installation)
4. Execute the Service
  * adb shell
  * cd /system/bin/MobiFace
  * ./MobiFaceService
5. Install the app and use liveness level 0,1,2,3 in [js/livenesschallenge.js](WebApp%20-%202020-01-30%20V%201.2/js/livenesschallenge.js#L256) at line 256 for slam liveness difficulty.

## For License

Starting SDK V 1.3, the old license that may be with you does not work.

The SDK, now uses the licenses generated using the LKMS server.

Make sure the device is connected to the internet and the internet is working.

When the App is installed and opened, it get the device ID and send to the LKMS server to get the License.

You'll see "License Fetched" when license is fetched from the server and stored in the Jio Folder at the root directory of the device.

#### Notes

1. The folder path has been hardcoded in the SDK, so make sure these folder are given correct permissions and are present.
2. The license.dat file is generated in the /data/MobiFace folder. 
3. For KaiOS WebIDE for ubuntu can be found at https://developer.kaiostech.com/simulator/linux
4. Make sure adb remount is available to push the files into system directory. To enable use
  * adb root
  * adb disable-verity
  * adb reboot
  * adb remount
5. The SDK will give result as a bestImage from SDK and matching score if reference image is passed onSuccess of Liveness. If somehow timeout occurs or spoof is detected, the SDK will give match score as 0 and show same refernce image that is passed by you to the API.


#### Changelog

* Given in the changelog.txt file present

## Important

1. Make sure to call stopFaceAnalysis when back is pressed from the smartphone, this is to ensure the memory is freed.


