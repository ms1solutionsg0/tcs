export const System = function System(sockets) {
    this.sockets = sockets;
};

System.prototype.shutdown = function shutdown() {
    const shutdownConfirmed = confirm('Press "OK" to confirm Rover shutdown.\nPlease press the Poweroff Button on the rover after pressing "OK"');
    if (shutdownConfirmed && this.sockets.io.connected) {
        this.sockets.io.emit('shutdown');
    }
};

System.prototype.reboot = function reboot() {
    if (this.sockets.io.connected) {
        this.sockets.io.emit('reboot');
    }
};
