directory_server - centralized endpoint behind restofthings.com
frontend - some html code to make use of all of the CORS
frontend - app that makes calls to directory_server on behalf of current ip
slave - code that runs on pi


install Webiopi

Remove auth

`sudo rm /etc/webiopi/passwd`


Install pi-gpio

`sudo apt-get install nodejs npm`

`git clone git://github.com/quick2wire/quick2wire-gpio-admin.git`

`cd quick2wire-gpio-admin`

`make`

`sudo make install`

`sudo adduser $USER gpio`


Install and configure nginx:

`sudo apt-get update`

`sudo apt-get install nginx`

`copy default file from pi-config-files to /etc/nginx/sites-*`

`service nginx start`


Nginx if used as a CORS proxy in this case(nginx will by default run on port `80`).

raspicam working example

At this point we'll try to use as an example the raspicam and mjpg streamer




For that you need to install raspistill:
\\link

For starting the camera: 

`$ mkdir /tmp/stream`

`$ raspistill --nopreview -w 640 -h 480 -q 5 -o /tmp/stream/pic.jpg -tl 100 -t 9999999 -th 0:0:0 &`

You need to install mjpg streamer:

http://blog.miguelgrinberg.com/post/stream-video-from-the-raspberry-pi-camera-to-web-browsers-even-on-ios-and-android

Than run: 

`LD_LIBRARY_PATH=/usr/local/lib mjpg_streamer -i "input_file.so -f /tmp/stream -n pic.jpg" -o "output_http.so -w /usr/local/www -p 9999"`

### Flow
* obtain device & plug it into network/power
* go to user.restofthings.com to find device listed
* Click link to go to dev ui(eg webiopi pinout page)
* Assign tags to device
* Have home automation software look up device by those tags
** Alternative: have some software deployed on one of the devices and do ^
* Enjoy
