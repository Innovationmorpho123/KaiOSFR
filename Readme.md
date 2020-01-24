# MobiFace (Development binary - Can be buggy)

1. The repo contains 2 zipped folders
  * MobiFace SDK - 2019-12-13 V 1.2
  * WebApp - 25-11-19 V 1.1

2. MobiFace SDK - 2019-12-13 V 1.2
  * Contains the SDK binaries along with the dependencies
  * The main Service is in MobiFaceService
  * libFrService.so calls functions inside of the service

3. WebApp - 25-11-19 V 1.1
  * Contains the Web App Sample App used to run the SDK.
  * Use KaiOS IDE to install the Web App onto the device (https://developer.kaiostech.com/getting-started/env-setup/simulator)

## Integration

1. Create and put the files from *2019-12-13 V 1.2.zip* inside */system/bin/MobiFace/* of device except the *libFrService.so* and *libgnustl_shared.so* 
2. Put *libFrService.so* and *libgnustl_shared.so* inside */system/lib/* folder of device
3. Create a folder */data/MobiFace* and give the folder permission to all user and groups and others using `chmod 777 /data/MobiFace` (required for license installation)
4. Execute the Service
  * adb shell
  * cd /system/bin/MobiFace
  * ./MobiFaceService
5. Install the app and use liveness level 0,1,2,3 in [js/livenesschallenge.js](WebApp%20-%2025-11-19%20V%201.1/js/livenesschallenge.js#L238) at line 238 for slam liveness difficulty.

## For License

Starting SDK V 1.3, the old license that may be with you does not work.

The SDK, now uses the licenses generated using the LKMS server.


Currently there is no way to manage license. To generate the license follow the steps:

1. start *adb shell*
2. Go to directory with command *cd /system/bin/MobiFace*
3. Execute *./RTVClient RC_20190417_164847.rtv 4 test.bmp*
4. Note the 64 char hex chars and send it to us
5. We will generate the license and send back to you the data.
6. Replace the line in the Sample App in [js/livenesschallenge.js](WebApp%20-%2025-11-19%20V%201.1/js/livenesschallenge.js#L120) at line 120 with the given data.

If You get error from running RTVClient as *Service Binding failed*, make sure you upload the latest MobiFaceService and reboot the device and then try again.


To generate the License on your own (Not recommended right now)


1. Get deviceID from the Device / Kai Smartphone
2. Post the data to License server
3. Get the JSON response
4. Exrtact the data part from JSON response
5. Decode with Base64
6. Convert the binary obtained to hex and set it as valus in the Sample App in [js/livenesschallenge.js](WebApp%20-%2025-11-19%20V%201.1/js/livenesschallenge.js#L120) at line 120 with the given data.

#### Notes

1. The folder path has been hardcoded in the SDK, so make sure these folder are given correct permissions and are present.
2. The license data is generated and is written in the Web App. License is generated using the *ro.expect.recovery_id* and *cid* i.e */sys/block/mmcblk0/device/cid* of the device.
3. The license.dat file is generated in the /data/MobiFace folder. 
4. For KaiOS WebIDE for ubuntu can be found at https://developer.kaiostech.com/simulator/linux
5. Make sure adb remount is available to push the files into system directory. To enable use
  * adb root
  * adb disable-verity
  * adb reboot
  * adb remount
6. The SDK will give result as a bestImage from SDK and matching score if reference image is passed onSuccess of Liveness. If somehow timeout occurs or spoof is detected, the SDK will give match score as 0 and show same refernce image that is passed by you to the API.


#### Changelog

* Given in the changelog.txt file present

## Issues

1. The App accepts the licenses data as a hex string, so you need the convert the License obtained from server into hex string and send call getFaceAnalysis(license) with the license data obtained after decoding base64 string.

2. Make sure to call stopFaceAnalysis when back is pressed from the smartphone, this is to ensure the memory is freed.


