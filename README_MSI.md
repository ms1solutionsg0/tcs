# README
## Turtle Bot
This is the client portion of the TurtleRover stack. The other portion is the `turtleos` repo.
The client controls the UI as well as the server interfacing with the controls. This also handles video connection with the `uv4l` server running on the raspberry pi host.

## Installation
### Dirty
- Build the files locally
	> `yarn build`
- scp to the pi
	> `scp -r ./dist pi@10.0.0.1:/home/pi`
- copy to the correct directory
	> `sudo cp -r dist /opt/tcs/turtlerover/client/`

### Clean
Run the commands in the readme for creating a .deb package.
Haven't gotten this to run correctly

### Sensor
- Sensor should be near the right front (near the USB ports) when installing the bottom portion of the Turtle Bot.
#### Pinout
- _BNO055_ `Vin` connects to the `5V` out on the _Arduino Nano_.
- _BNO055_ `GND` connects to the `Ground` out on the _Arduino Nano_.
- _BNO055_ `SCL` connects to the `SCL` pin on the _Arduino Nano_.
	- The `SCL` pin on the _Arduino Nano_ is known as `A5`.
- _BNO055_ `SDA` connects to the `SDA` pin on the _Arduino Nano_.
	- The `SDA` pin on the _Arduino Nano_ is known as `A4`.
- Reference:
	- `https://learn.adafruit.com/adafruit-bno055-absolute-orientation-sensor/arduino-code`