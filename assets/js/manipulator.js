/*
 *  this file contains functions which support manipulator control functionality
 * 
 *  It uses the Revealing Module Pattern
 *  https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript
 */

var manipulator = ( function () {
    /*
     *                                                                      PRIVATE area
     */

    const INTERVAL = 2000;    //  20 ms is the period of servo timing. It is used in this approach to change speed of servo mechanisms

    /*
     *  X0 and Y0 are the resting place coordinates (stow)
     */
    const X0 = 5;
    const Y5 = 5;

    //  object constructor for the array elements
    function position(servo_1, servo_2) {
        this.alpha = servo_1;
        this.beta = servo_2;
    }

    /*
     * values generated by Octave
     * -----------------------------------------------------------------------------------------
     */
    const alpha = [
        [83.8,83.8,85.3,85.3,86.9,86.9,86.9,88.4,88.4,90,90,90,90,90,90],
        [82.2,82.2,83.8,83.8,85.3,85.3,86.9,86.9,86.9,88.4,88.4,90,90,90,90],
        [80.7,82.2,82.2,83.8,83.8,83.8,85.3,85.3,86.9,86.9,86.9,88.4,88.4,90,90],
        [80.7,80.7,80.7,82.2,82.2,83.8,83.8,83.8,85.3,85.3,86.9,86.9,86.9,88.4,88.4],
        [79.1,79.1,80.7,80.7,80.7,82.2,82.2,83.8,83.8,83.8,85.3,85.3,86.9,86.9,86.9],
        [77.6,79.1,79.1,79.1,80.7,80.7,80.7,82.2,82.2,83.8,83.8,83.8,85.3,85.3,86.9],
        [77.6,77.6,77.6,79.1,79.1,79.1,80.7,80.7,82.2,82.2,82.2,83.8,83.8,83.8,85.3],
        [76,76,77.6,77.6,77.6,79.1,79.1,79.1,80.7,80.7,80.7,82.2,82.2,83.8,83.8],
        [74.5,76,76,76,77.6,77.6,77.6,79.1,79.1,79.1,80.7,80.7,80.7,82.2,82.2],
        [74.5,74.5,74.5,76,76,76,77.6,77.6,77.6,79.1,79.1,79.1,80.7,80.7,80.7],
        [72.9,72.9,74.5,74.5,74.5,76,76,76,77.6,77.6,77.6,79.1,79.1,79.1,80.7],
        [71.4,72.9,72.9,72.9,74.5,74.5,74.5,76,76,76,77.6,77.6,77.6,79.1,79.1],
        [71.4,71.4,71.4,72.9,72.9,72.9,74.5,74.5,74.5,76,76,76,77.6,77.6,77.6],
        [69.8,69.8,71.4,71.4,71.4,72.9,72.9,72.9,74.5,74.5,74.5,74.5,76,76,76],
        [68.3,69.8,69.8,69.8,71.4,71.4,71.4,72.9,72.9,72.9,74.5,74.5,74.5,74.5,76]
    ];

    const beta = [
        [140,140,140,140,140,140,140,140,140,140,140,140,140,140,139],
        [139,139,139,139,139,139,139,139,139,139,139,139,139,139,139],
        [138,138,138,138,138,138,138,138,138,138,138,138,138,138,138],
        [136,136,136,136,136,136,136,136,136,136,136,136,136,136,136],
        [135,135,135,135,135,135,135,135,135,135,135,135,135,135,135],
        [133,133,133,133,133,133,133,133,133,133,133,133,133,133,133],
        [132,132,132,132,132,132,132,132,133,132,132,132,132,132,132],
        [131,131,131,131,131,131,131,131,131,131,131,131,131,131,131],
        [129,129,129,129,129,129,129,129,129,129,129,129,129,129,129],
        [128,128,128,128,128,128,128,128,128,128,128,128,128,128,128],
        [127,127,127,127,127,127,127,127,127,127,127,127,127,127,127],
        [125,125,125,125,125,125,125,125,125,125,125,125,125,125,125],
        [124,124,124,124,124,124,124,124,124,124,124,124,124,124,124],
        [122,122,122,122,122,122,122,122,122,122,122,122,122,122,122],
        [121,121,121,121,121,121,121,121,121,121,121,121,121,121,121]
    ];
    /*
     * -----------------------------------------------------------------------------------------
     */

    /*
     *  calibration values for servomechanisms
     *  may be used with other value than deg90 and deg0 (that's why there are variables degrees and shift)
     */
    function servoCalibration(deg0, deg90, degrees, shift) {
        this.degree = (deg90 - deg0)/degrees;
        this.zero = deg0 + shift;
    }

    function getServoPosition(servo, degrees) {
        return (servo.zero + servo.degree * degrees);
    }

    var servoAlpha = new servoCalibration(2150, 1200, 90, 0);
    var servoBeta = new servoCalibration(1875, 1400, 45, 475);

    //  generated values for servo and different angles
    var anglesArray = [];

    for (i = 0; i < alpha.length; i++) {
        anglesArray[i] = [];
        for (j = 0; j < alpha[0].length; j++) {
            var temp = new position(getServoPosition(servoAlpha, alpha[i][j]), getServoPosition(servoBeta, beta[i][j]));
            anglesArray[i][j] = temp;
            console.log(temp.alpha + "\t" + temp.beta);
        }
    }

    //  contains coordinates for the anglesArray
    var currentPosition = {
        x: 0,
        y: 7,
        alpha: 0,
        beta: 0,
        checkDimensions: function () {
            if (this.x >= anglesArray.length) this.x = anglesArray.length;
            else if (this.x < 0) this.x = 0;

            if (this.y >= anglesArray[0].length) this.y = anglesArray[0].length;
            else if (this.y < 0) this.y = 0;
        }
    }

    /*
	 * 																		SUBSCRIBE to all topics
	 */
    amplify.subscribe("controlCanvas->manipulator", controlCanvasCallback);

    /*
     *                                                                      CALLBACKS
     */
    function controlCanvasCallback(message) {
        if (DEBUG) console.log("controlCanvasCallback: " + message);
		if (DEBUG) amplify.publish("all->utests", message);

        switch (message) {
            case "move":
                move();
                break;
            case "stow":
                break;
            case "stop":
                stop();
                break;
            default:
                console.log("unknown command: " + message);
        }
    };

    /*
     *                                                                      MOVE functionality
     */

    var moveInterval;
    /*
     *  move in the desired direction
     */
    function move() {
        var manipulatorMove = controlCanvas.getManipulatorMove();

        //moveInterval = setInterval(nextStep, INTERVAL, manipulatorMove);
        nextStep(manipulatorMove);
    };

    function stop(){
        clearInterval(moveInterval);
    };

    /*
     *  execute next step in intervals
     */
    function nextStep(manipulatorMove) {
        switch(manipulatorMove.direction) {
            case "up":
                currentPosition.y++;
                break;
            case "down":
                currentPosition.y--;
                break;
            case "right":
                currentPosition.x++;
                break;
            case "left":
                currentPosition.x--;
                break;
            default:
                console.log("wrong direction");
        }

        //  to nearest if outside range
        currentPosition.checkDimensions();

        console.log("currentPosition.x: " + currentPosition.x + "\tcurrentPosition.y: " + currentPosition.y);

        currentPosition.alpha = anglesArray[currentPosition.x][currentPosition.y].alpha;
        currentPosition.beta = anglesArray[currentPosition.x][currentPosition.y].beta;

        amplify.publish("manipulator->port8080", "set new servo position");
    };

    /*
     *                                                                      REVEALED functions
     */
    function getCurrentPositionPriv() {
        return currentPosition;
    };

    function setPositionPriv() {};

    /*
     *                                                                      PUBLIC area
     */
    return {
        getCurrentPosition : getCurrentPositionPriv,
        setPosition : setPositionPriv
    };
})();
