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
        [29.3,36.3,43.2,51.4,59.5,67.6,75.8,85.1,94.3,102,109,116,122,126,129,133,133,134,134,133,133,130,129,128,126],
[28.1,35.1,42.1,50.2,58.3,66.5,74.6,82.7,90.9,99,105,112,118,122,126,127,129,130,130,129,129,128,127,125,123],
[29.3,36.3,43.2,49,57.2,64.1,72.3,79.2,88.5,94.3,102,107,114,118,121,123,125,125,126,126,126,125,123,121,120],
[28.1,35.1,42.1,47.9,56,63,71.1,78.1,85.1,92,97.8,105,109,113,118,119,120,121,122,122,122,121,120,119,116],
[29.3,35.1,40.9,47.9,54.8,61.8,69.9,75.8,82.7,88.5,94.3,100,105,109,113,115,116,119,119,119,119,119,116,116,114],
[28.1,35.1,39.7,47.9,53.7,60.7,66.5,73.4,79.2,86.2,92,96.7,102,105,108,111,114,115,115,116,115,115,114,113,112],
[27,33.9,39.7,46.7,52.5,58.3,65.3,71.1,78.1,82.7,88.5,94.3,97.8,102,106,108,109,111,112,113,113,112,111,109,108],
[27,32.8,38.6,45.6,51.4,57.2,64.1,69.9,74.6,81.6,86.2,90.9,94.3,99,101,104,107,108,109,108,109,108,108,107,106],
[25.8,31.6,37.4,44.4,49,56,61.8,67.6,73.4,78.1,82.7,88.5,92,94.3,99,101,102,105,105,106,106,106,105,104,102],
[25.8,31.6,37.4,42.1,47.9,54.8,59.5,65.3,71.1,75.8,81.6,85.1,88.5,92,95.5,97.8,100,101,102,104,102,102,102,101,100],
[24.6,30.5,36.3,40.9,46.7,52.5,58.3,63,68.8,73.4,78.1,82.7,86.2,88.5,92,95.5,96.7,97.8,99,100,100,100,99,97.8,96.7],
[23.5,29.3,35.1,39.7,45.6,51.4,56,61.8,66.5,71.1,75.8,79.2,82.7,86.2,88.5,90.9,93.2,94.3,95.5,96.7,96.7,96.7,96.7,95.5,94.3],
[22.3,28.1,33.9,39.7,44.4,50.2,54.8,59.5,64.1,68.8,73.4,76.9,80.4,83.9,86.2,88.5,90.9,92,93.2,93.2,94.3,94.3,93.2,92,90.9],
[22.3,27,32.8,37.4,43.2,47.9,52.5,57.2,61.8,66.5,69.9,74.6,78.1,80.4,83.9,86.2,87.4,88.5,89.7,90.9,90.9,90.9,90.9,89.7,88.5],
[21.2,25.8,30.5,36.3,40.9,46.7,51.4,56,59.5,64.1,68.8,71.1,74.6,78.1,80.4,82.7,85.1,86.2,87.4,87.4,88.5,87.4,87.4,86.2,85.1],
[20,24.6,29.3,35.1,39.7,44.4,49,53.7,57.2,61.8,65.3,68.8,72.3,74.6,78.1,80.4,81.6,82.7,83.9,85.1,85.1,85.1,85.1,83.9,82.7],
[20,23.5,28.1,32.8,37.4,42.1,46.7,51.4,56,59.5,63,66.5,69.9,72.3,74.6,76.9,79.2,80.4,81.6,81.6,81.6,81.6,81.6,80.4,79.2],
[20,21.2,27,31.6,36.3,40.9,45.6,49,53.7,57.2,60.7,64.1,67.6,69.9,72.3,74.6,75.8,76.9,78.1,79.2,79.2,79.2,78.1,76.9,75.8],
[20,20,24.6,29.3,33.9,38.6,43.2,47.9,51.4,54.8,58.3,61.8,64.1,67.6,69.9,71.1,73.4,74.6,75.8,75.8,75.8,75.8,75.8,74.6,72.3],
[20,20,23.5,28.1,32.8,37.4,40.9,45.6,49,52.5,56,59.5,61.8,64.1,66.5,68.8,69.9,71.1,72.3,73.4,72.3,72.3,71.1,69.9,68.8],
[20,20,21.2,25.8,30.5,35.1,38.6,43.2,46.7,50.2,53.7,57.2,59.5,61.8,64.1,65.3,67.6,68.8,68.8,69.9,69.9,69.9,68.8,67.6,64.1],
[20,20,20,23.5,28.1,32.8,36.3,40.9,44.4,47.9,51.4,53.7,57.2,59.5,60.7,63,64.1,65.3,66.5,66.5,66.5,65.3,65.3,63,60.7],
[20,20,20,22.3,27,30.5,35.1,38.6,42.1,45.6,47.9,51.4,53.7,56,58.3,60.7,61.8,63,63,63,63,61.8,60.7,59.5,56],
[20,20,20,20,23.5,28.1,32.8,36.3,39.7,42.1,45.6,49,51.4,53.7,54.8,57.2,58.3,59.5,59.5,59.5,60.7,59.5,57.2,54.8,53.7],
[20,20,20,20,21.2,25.8,29.3,33.9,37.4,39.7,43.2,45.6,47.9,50.2,52.5,53.7,54.8,56,56,56,56,53.7,52.5,49,51.4]
    ];

    const beta = [
        [112,115,117,121,125,131,136,143,150,157,164,170,177,183,188,194,198,202,206,209,213,215,220,222,225],
[113,116,119,123,127,132,138,143,150,157,162,169,176,181,187,191,196,200,205,207,211,214,218,221,225],
[116,119,121,124,128,132,138,143,150,155,162,168,175,180,185,190,194,198,202,206,210,213,217,220,224],
[117,120,123,125,130,134,139,145,150,155,161,168,173,179,184,188,192,196,200,205,209,211,215,220,222],
[120,121,124,127,131,135,140,145,150,155,161,166,172,177,183,187,191,196,200,203,207,211,214,218,221],
[121,124,125,130,132,136,140,146,150,155,161,166,172,176,181,185,191,195,199,203,206,210,214,217,221],
[123,125,128,131,134,138,142,146,151,155,161,166,170,176,181,185,190,194,198,202,206,209,213,217,220],
[125,127,130,132,135,139,143,147,151,157,161,166,170,176,180,184,190,194,198,200,205,209,213,215,220],
[127,128,131,134,136,140,145,149,153,157,161,166,170,175,180,184,188,192,196,200,205,209,211,215,220],
[128,131,132,135,138,142,145,149,153,157,162,166,170,175,180,184,188,192,196,200,203,207,211,215,218],
[131,132,135,136,139,143,146,150,154,158,162,166,170,175,179,184,188,192,195,199,203,207,211,214,218],
[132,134,136,138,140,145,147,151,154,158,162,166,170,175,179,183,187,191,195,199,203,207,210,214,218],
[134,135,138,140,142,146,149,151,155,160,164,168,172,176,179,183,187,191,195,199,203,207,210,214,218],
[136,138,139,142,145,147,150,153,157,160,164,168,172,176,180,184,187,191,195,199,203,206,210,214,218],
[138,139,140,143,146,149,151,154,157,161,165,168,172,176,180,184,188,191,195,199,203,207,210,214,218],
[139,140,143,145,147,150,153,155,158,162,165,169,173,176,180,184,188,191,195,199,203,207,210,214,218],
[140,143,145,146,149,151,154,157,160,162,166,169,173,177,180,184,188,192,195,199,203,207,211,214,218],
[143,145,146,147,150,153,155,158,161,164,168,170,175,177,181,185,188,192,196,199,203,207,211,215,220],
[145,146,147,150,151,154,157,160,162,165,168,172,175,179,181,185,190,192,196,200,205,207,211,215,220],
[146,147,150,151,153,155,158,161,164,166,169,172,176,179,183,185,190,194,196,200,205,209,213,217,221],
[147,150,151,153,155,157,160,162,165,168,170,173,177,180,183,187,191,194,198,202,205,209,213,217,222],
[149,151,153,155,157,158,161,164,166,169,172,175,177,181,184,188,191,195,198,202,206,210,214,218,224],
[150,153,154,157,158,161,162,165,168,170,173,176,179,183,185,188,192,195,199,203,207,211,215,220,225],
[151,154,155,158,161,162,164,166,169,172,175,177,180,183,187,190,194,196,200,205,207,211,217,221,225],
[153,155,157,160,162,164,166,168,170,173,176,179,181,184,188,191,195,198,202,206,209,214,218,224,225]
    ];
    /*
     * -----------------------------------------------------------------------------------------
     */

    var gripperPosition = {
        gripperTimer: 3600
    }

    /*
	 * 																		SUBSCRIBE to all topics
	 */
    amplify.subscribe("controlCanvas->manipulator", controlCanvasCallback);
    amplify.subscribe("ui->manipulator", uiCallback);

    /*
     *                                                                      CALLBACKS
     */
    function controlCanvasCallback(message) {
        if (DEBUG) console.log("controlCanvasCallback: " + message);
		if (DEBUG) amplify.publish("all->utests", message);

        switch (message) {
            /*case "move":
                move();
                break;
            case "stow":
                break;
            case "stop":
                stop();
                break;*/
            default:
                console.log("unknown command: " + message);
        }
    };

    function uiCallback(message) {
        if (DEBUG) console.log("uiCallback: " + message);
		if (DEBUG) amplify.publish("all->utests", message);
        switch (message) {
            case "move mani":
                moveMani();
                break;
            default:
                console.log("unknown command: " + message);
        }
    }

    /*
     *                                                                      MOVE functionality
     */
    function moveMani() {
        var mani_x = $("#mani-x").val();
        var mani_y = $("#mani-y").val();

        const ONE_DEGREE = 7;   // 7 us for one degree
        const T0 = 1500;    // 1500 us

        var alphaAngle = alpha[mani_y][mani_x];
        var betaAngle = beta[mani_y][mani_x];

        console.log("alphaAngle: " + alphaAngle);
        console.log("betaAngle: " + betaAngle);

        var alphaDelta = -(90 - alphaAngle);
        var betaDelta = 180 - betaAngle;

        var alphaDeltaT = ONE_DEGREE * alphaDelta;
        var betaDeltaT = ONE_DEGREE * betaDelta;

        var alphaNewT = 1500 + alphaDeltaT;
        var betaNewT = 1500 + betaDeltaT;

        //  48000 depends on STM timer
        var alphaNew = alphaNewT/20000 * 48000;
        var betaNew = betaNewT/20000 * 48000; 

        $("#mani-axis-1").val(Math.round(alphaNew));
        $("#mani-axis-2").val(Math.round(betaNew));

        amplify.publish("ui->port8080", "set new mani position");
    }

    /*
     *                                                                      REVEALED functions
     */
    function getCurrentPositionPriv() {
        return currentPosition;
    };

    function getGripperPositionPriv() {
        return gripperPosition.gripperTimer;
    };

    function setPositionPriv() {};

    /*
     *                                                                      PUBLIC area
     */
    return {
        //getCurrentPosition : getCurrentPositionPriv,
        getGripperPosition : getGripperPositionPriv,
        setPosition : setPositionPriv
    };
})();

