import io from 'socket.io-client';

export const Sockets = function Sockets(actions) {
    this.preventFlipForward = false;
    this.preventFlipBackward = false;
    this.io = io.connect('http://' + document.domain + '/sockets', {
        transports: ['websocket'],
    });
    this.io.on('connect', () => {
        console.info('[sockets] Connection established via WebSockets');
    });
    this.io.on('connected', (msg) => {
        actions.setSystemInfo(msg);
    });
    this.io.on('response', (msg) => {
        console.info('[sockets] Response:', msg);
        const { type, value } = msg;

        if (type === "preventFlip" && value === "forward") {
            console.log("NEAL: inside preventFlip forward");
            actions.preventFlipForward(true);
            const stopArray = new ArrayBuffer(4);
            this.sendMotors(stopArray);
            this.preventFlipForward = true;
        } else if (type === "preventFlip" && value === "backward") {
            console.log("NEAL: inside preventFlip backward");
            actions.preventFlipBackward(true);
            const stopArray = new ArrayBuffer(4);
            this.sendMotors(stopArray);
            this.preventFlipBackward = true;
        } else if (this.preventFlipForward) {
            console.log("NEAL: clear preventFlipForward");
            actions.preventFlipForward(false);
            this.preventFlipForward = false;
        } else if (this.preventFlipBackward) {
            console.log("NEAL: clear preventFlipBackward");
            actions.preventFlipBackward(false);
            this.preventFlipBackward = false;
        }
        
    });
};

Sockets.prototype.sendMotors = function sendMotors(data) {
    this.io.emit('motors', data);
};

Sockets.prototype.sendManipulator = function sendManipulator(data) {
    this.io.emit('manipulator', data);
};

Sockets.prototype.sendGripper = function sendGripper(data) {
    this.io.emit('gripper', data);
};

Sockets.prototype.getPreventFlipForward = function getPreventFlipForward() {
    return this.preventFlipForward;
}

Sockets.prototype.getPreventFlipBackward = function getPreventFlipBackward() {
    return this.preventFlipBackward;
}
