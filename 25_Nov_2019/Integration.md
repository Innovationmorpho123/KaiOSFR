# Integration

### Following are the steps that can be carried for integration:
 

1. Put Binaries from https://github.com/Innovationmorpho123/KaiOSFR/tree/master/25_Nov_2019 (2019-11-25 V 1.1.zip) into any folder (preferably /system/etc/ with new Folder with Name MobiFace)

 

2. To re-enable the license insertion from App Side, uncomment line no.: 55 to 63 in FrService.cpp present inside folder   FrServiceClient/FrServiceLibrary (From the git repo https://github.com/Innovationmorpho123/KaiOSFR/tree/master/25_Nov_2019 in FrServiceClient.zip).

 

3. Make sure to update the path at line 57 with /system/etc/MobiFace or the location where the MobiFace binaries and its dependency are present to enable the MobifaceService read the license and work accordingly.

 

4. The binaries and all .dat files should be put with the MobiFaceService binary.

 

4. Create a init.rc file for the MobiFaceService so that it starts as a service on device boot and run throughout device cycle.

 

6. The libFrService.so and libgnustl_shared.so generated should be present in /system/lib to allow the App communication to the MobifaceService.


