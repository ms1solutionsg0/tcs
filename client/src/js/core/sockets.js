import io from 'socket.io-client';

export const Sockets = function Sockets(actions) {
    this.preventFlip = 'normal';
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

        if (type === "preventFlip") {
            if (value === "forward") {
                actions.preventFlip(value);
                const stopArray = new ArrayBuffer(4);
                this.sendMotors(stopArray);
                this.preventFlip = value;
            }
            else if (value === "backward") {
                actions.preventFlip(value);
                const stopArray = new ArrayBuffer(4);
                this.sendMotors(stopArray);
                this.preventFlip = value;
            }
            else if (value === "normal") {
                actions.preventFlip(value);
                this.preventFlip = value;
            }
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

Sockets.prototype.getPreventFlip = function getPreventFlip() {
    return this.preventFlip;
}

