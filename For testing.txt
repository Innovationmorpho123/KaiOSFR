Steps for Testing:

The license file would remain the same as shared previously.

1. Create new folder "test" in Jio Device under /data
	adb shell mkdir /data/test

2. Copy all files (initBlock.dat, initBlockML.dat, initBlock_STANDARD_FACE_F5_0_VID81.dat, libgnustl_shared.so, MobiFaceService, RTVClient_FrService, license.dat,
	RC_20190417_164847.rtv) in the /data/test/ folder of the device.

	adb push <fileName> /data/test

3. Copy file (libFrService.so) into /system/lib using
	
	adb push libFrService.so /system/lib

4. Chmod files (MobiFaceService, RTVClient_FrService) present in /data/test

	chmod 755 MobiFaceService
	chmod 755 RTVClient_FrService

5. Run the below command in a separate shell to start MobiFaceService in background:
	adb shell 
		export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:.
		cd /data/test
		./MobiFaceService

6. Download and Run the TestApp and check the logs using adb logcat
	adb logcat | grep Mobi
		<or>
	      adb logcat

===================================================== FOR RTVClient ======================================================================

7. Run the below command in a separate shell to start RTVClient_FrService for Enrollment and Verification:
	adb shell 
		export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:.
		cd /data/test
		./RTVClient_FrService RC_20190417_164847.rtv {livenessLevel} test.bmp
		
	{livenessLevel} willbe replcaed with 0, 1, 2, 3, 4
	livenessLevel: 0 = no liveness
	livenessLevel: 1,2,3 = slam liveness
	livenessLevel: 4 = CR2D liveness
	
	RC_20190417_164847.rtv is a test video containing the face movements of a person.

8. Running the command in point 3 will execute the Enrollment by capturing a best image (test.bmp) from the video (RC_20190417_164847.rtv).
	This will create a test.bmp image in the folder as specified in the command.

9. Running the command in point 3 again will check if test.bmp exists. If it exists, it will capture best image from video but this time, 
	it will compare it to the already exisiting test.bmp fiel and give a matchinbg score. 
	Currently the score returned has been hardcoded. The matching algorithm part will be developed later.
	
10. FrServiceClient.zip contains the project for executable file RTVClient_FrService and can me modified to take direct input from camera 
	instead of the RTV video file.
