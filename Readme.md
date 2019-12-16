# MobiFace

1. The repo contains 2 zipped folders
  * MobiFace SDK - 2019-12-13 V 1.2
  * WebApp

2. MobiFace SDK - 2019-12-13 V 1.2
  * Contains the SDK binaries along with the dependencies
  * The main Service is in MobiFaceService
  * libFrService.so calls functions inside of the service

3. WebApp
  * Contains the Web App Sample App used to run the SDK.
  * Use KaiOS IDE to install the Web App onto the device (https://developer.kaiostech.com/getting-started/env-setup/simulator)

## Integration

1. Create and put the files from *2019-12-13 V 1.2.zip* inside */system/bin/MobiFace/* of device except the *libFrService.so* and *libgnustl_shared.so* 
2. Put *libFrService.so* and *libgnustl_shared.so* inside */system/lib/* folder of device
3. Create a folder */data/MobiFace* and give the folder permission to all user and groups and others using `chmod 777 /data/MobiFace` (required for license installation)
4. Create an entry in *init.rc* for MobiFaceService so that it can be started on device boot

#### Notes

1. The folder path has been hardcoded in the SDK, so make sure these folder are given correct permissions and are present.
2. The license data is generated and is written in the Web App. License is genrated using the *ro.expect.recovery_id* of the device.
3. The license.dat file is generated in the /data/MobiFace folder. 
4. For KaiOS WebIDE for ubuntu can be found at https://developer.kaiostech.com/simulator/linux

#### Changelog

* Given in the changelog.txt file present
