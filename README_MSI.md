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
