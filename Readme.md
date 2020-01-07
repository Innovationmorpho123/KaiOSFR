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
5. Install the app and use liveness level 0,1,2,3 in [js/livenesschallenge.js](WebApp%20-%2025-11-19%20V%201.1/js/livenesschallenge.js#238) at line 238 for slam liveness difficulty.

## For License

Currently there is no way to manage license. To generate the license follow the steps:

1. start *adb shell*
2. Go to directory with command *cd /system/bin/MobiFace*
3. Execute *./RTVClient RC_20190417_164847.rtv 0 test.bmp*
4. Note the 64 char hex chars and send it to us
5. We will generate the license and send back to you the data.
6. Replace the line in the Sample App in [js/livenesschallenge.js](WebApp%20-%2025-11-19%20V%201.1/js/livenesschallenge.js#120) at line 120 with the given data.

#### Notes

1. The folder path has been hardcoded in the SDK, so make sure these folder are given correct permissions and are present.
2. The license data is generated and is written in the Web App. License is generated using the *ro.expect.recovery_id* and *cid* i.e */sys/block/mmcblk0/device/cid* of the device.
3. The license.dat file is generated in the /data/MobiFace folder. 
4. For KaiOS WebIDE for ubuntu can be found at https://developer.kaiostech.com/simulator/linux
5. Make sure adb remount is available. To enable use
  * adb root
  * adb disable-verity
  * adb reboot
  * adb remount


#### Changelog

* Given in the changelog.txt file present
