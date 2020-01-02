# MobiFace

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
4. Create an entry in *init.rc* for MobiFaceService so that it can be started on device boot

## For License

Currently there is no way to manage license. To generate the license follow the steps:

1. start *adb shell*
2. Go to directory with command *cd /system/bin/MobiFace*
3. Execute *./RTVClient RC_20190417_164847.rtv 0 test.bmp*
4. Note the 64 char hex chars and send it to us
5. We will generate the license and send back to you the data.
6. Replace the line in the Sample App in js/livenesschallenge.js at line 120 with the given data.
7. This will install the license in the */data/MobiFace* folder with name as license.dat

#### Notes

1. The folder path has been hardcoded in the SDK, so make sure these folder are given correct permissions and are present.
2. The license data is generated and is written in the Web App. License is generated using the *ro.expect.recovery_id* and *cid* i.e */sys/block/mmcblk0/device/cid* of the device.
3. The license.dat file is generated in the /data/MobiFace folder. 
4. For KaiOS WebIDE for ubuntu can be found at https://developer.kaiostech.com/simulator/linux

#### Changelog

* Given in the changelog.txt file present
