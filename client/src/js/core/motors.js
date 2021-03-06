import { Frame } from './frame';
import { helper } from '../utils/helper';

export const Motors = function(sockets) { 
    this.sockets = sockets;
    this.frame = new Frame();

    // Rover Wheel Alignment: [Top Right, Top Left, Bottom Left, Bottom Right]
    this.direction = {
        forward : [0, 0, 0, 0],
        backward: [1, 1, 1, 1],
        left: [0, 0, 0.5, 0],
        right: [0, 0, 0, 0.5]
    };
};

Motors.prototype.stop = function() {
    if (this.sockets.io.connected) {
        var buf = new ArrayBuffer(4);
        var arr = new Uint8Array(buf);

        //  command to send
        arr[0] = 0;
        arr[1] = 0;
        arr[2] = 0;
        arr[3] = 0;
        console.log("Halt!", buf);
        this.sockets.sendMotors(buf);
    } else console.log("Connection not opened.");
};

Motors.prototype.set = function (speed, directions) {
    const preventFlipDirection = this.sockets.getPreventFlip();

    if (this.sockets.io.connected) {
        if (preventFlipDirection !== 'normal') {
            const goDirection = preventFlipDirection === "forward" ? this.direction.backward : this.direction.forward;
            const frame = this.frame.motors(60, goDirection, this.direction);
            this.sockets.sendMotors(frame);
            return;
        }

        const frame = this.frame.motors(speed, directions, this.direction);
        console.log(helper.arrayToHex(this.frame.motorsArr));
        this.sockets.sendMotors(frame);
    } else {
        console.log("Connection not opened.");
    }
}

Motors.prototype.getPreventFlip = function() {
    const preventFlipDirection = this.sockets.getPreventFlip();
    return preventFlipDirection;
}
