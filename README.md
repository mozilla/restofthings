**RESTofThings** is  a project that aims to facilitate ioT applications using `rot.js` API.
It has three major components:

 * directory server - a webServer that handles registration of powered on boards
 * slave server - server running on a device that has a UUID and pings the directory server
 * rot.js api - REST API for building ioT apps

A presentation about this project here:

http://raluca-elena.github.io/iot-preso/#/start



Video about this project here:
https://air.mozilla.org/the-rest-of-things/


Demos implemented using this API here:

https://www.youtube.com/watch?v=TAdbb2Q3EPA

https://www.youtube.com/watch?v=6PMdVHsdFBk `(workflow)`

https://www.youtube.com/watch?v=YiZ1fmrOfW0

### Flow
* obtain device & plug it into network/power
* go to user.restofthings.com to find device listed
* Click link to go to dev ui(eg webiopi pinout page)
* Assign tags to device
* Have home automation software look up device by those tags
** Alternative: have some software deployed on one of the devices and do ^
* Enjoy
