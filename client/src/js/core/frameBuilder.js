export const FrameBuilder = function() {
    this.motorsBuf = new ArrayBuffer(4);
    this.motorsArr = new Uint8Array(this.motorsBuf);

    this.gripperBuf = new ArrayBuffer(2);
    this.gripperArr = new Uint8Array(this.gripperBuf);

    this.batteryBuf = new ArrayBuffer(1);
    this.batteryArr = new Uint8Array(this.gripperBuf);
};

FrameBuilder.prototype.motor = function(value) {
    // Multiplying by this value should make possible to write directly to PWM
    // Current range is 0 - 127 with first bit as direction
    // Gets 0-100 
    let k = 1.27;
    return Math.round(Math.abs(value * k) | (value & 0x80));
};

FrameBuilder.prototype.motors = function(speed, directions) {   
    this.motorsArr.forEach ((motor, index) => {
        this.motorsArr[index] = Math.abs(speed * 1.27) | (directions[index] << 7);
    });
    return this.motorsBuf;
};

// THIS IS NOT OK. TODO: MERGE THESE TWO MOTORS FUNCTIONS !!!
// Probably canvas also should return array of directions, not minus value

FrameBuilder.prototype.motorKeyboard = function(value, motor_number) {
    let k = 1.27;
    let speed = Math.abs(value.speed * k);
    let result = Math.abs(value.speed * k) | (value.direction[motor_number] << 7);
    console.log(speed, result.toString(2));
    
    return result;
};

FrameBuilder.prototype.motorsKeyboard = function(mov) {
    console.log(mov);
    this.motorsArr[0] = this.motorKeyboard(mov, 0); //	Left front
    this.motorsArr[1] = this.motorKeyboard(mov, 1); //	Right front
    this.motorsArr[2] = this.motorKeyboard(mov, 2); //	Left rear
    this.motorsArr[3] = this.motorKeyboard(mov, 3); //	Right rear
    return this.motorsBuf;
};

FrameBuilder.prototype.gripper = function(gripperPosition) {
    console.log("Gripper position: " + gripperPosition);
    this.gripperArr[0] = (gripperPosition >> 8) & 0xFF;
    this.gripperArr[1] = gripperPosition & 0xFF;
    return this.gripperBuf;
};

FrameBuilder.prototype.manipulator = function(axis_1, axis_2) {
    console.log("Mani position: " + axis_1 + "\t" + axis_2);
    this.motorsArr[0] = (axis_1 >> 8) & 0xFF;
    this.motorsArr[1] = axis_1 & 0xFF;
    this.motorsArr[2] = (axis_2 >> 8) & 0xFF;
    this.motorsArr[3] = axis_2 & 0xFF;
    return this.motorsBuf;
};

FrameBuilder.prototype.battery = function(axis_1, axis_2) {
    console.log("Mani position: " + axis_1 + "\t" + axis_2);
    this.motorsArr[0] = (axis_1 >> 8) & 0xFF;
    this.motorsArr[1] = axis_1 & 0xFF;
    this.motorsArr[2] = (axis_2 >> 8) & 0xFF;
    this.motorsArr[3] = axis_2 & 0xFF;
    return this.motorsBuf;
};