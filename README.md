directory_server - centralized endpoint behind restofthings.com
frontend - some html code to make use of all of the CORS
frontend - app that makes calls to directory_server on behalf of current ip
slave - code that runs on pi


install Webiopi
# Remove auth
sudo rm /etc/webiopi/passwd

Install and configure nginx:
sudo apt-get update
sudo apt-get install nginx
copy default file from pi-config-files to /etc/nginx


Nginx if used as a CORS proxy in this case.

### Flow
* obtain device & plug it into network/power
* go to user.restofthings.com to find device listed
* Click link to go to dev ui(eg webiopi pinout page)
* Assign tags to device
* Have home automation software look up device by those tags
** Alternative: have some software deployed on one of the devices and do ^
* Enjoy
