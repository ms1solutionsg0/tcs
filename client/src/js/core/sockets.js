import io from 'socket.io-client';

export const Sockets = function Sockets(actions) {
    this.preventFlip = 'normal';
    
    const preventFlipTrigger = (value) => {
        actions.preventFlip(value);
        this.preventFlip = value;
        actions.motors.stop();
    }

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
            if (value === "forward" || value === "backward") {
                preventFlipTrigger(value);
                setTimeout(() => actions.motors.set(60, value), 500);
            } else {
                setTimeout(() => preventFlipTrigger(value) , 1500);
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

