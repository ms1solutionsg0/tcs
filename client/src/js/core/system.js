export const System = function System(sockets) {
    this.sockets = sockets;
};

System.prototype.shutdown = function shutdown() {
    const shutdownConfirmed = confirm('Please press the Poweroff Button on the rover');
    if (shutdownConfirmed && this.sockets.io.connected) {
        this.sockets.io.emit('shutdown');
    }
};

System.prototype.reboot = function reboot() {
    if (this.sockets.io.connected) {
        this.sockets.io.emit('reboot');
    }
};
