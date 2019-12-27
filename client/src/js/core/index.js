import { Sockets } from './sockets';
import { keyboard } from './keyboard';
import { joystick } from './joystick';
import { Motors } from './motors';
import { Manipulator } from './manipulator';
import { telemetry } from './telemetry';
import { Stream } from './stream';
import { System } from './system';
import { Clupi } from './clupi';

const core = (actions) => {
    const sockets = new Sockets(actions);
    actions.motors = new Motors(sockets);

    actions.stream = new Stream(actions);
    window.onbeforeunload = () => actions.stream.stop();
    window.addEventListener('online', () => {
        actions.stream.allowReconnect();
        actions.stream.start();
    });
    window.addEventListener('offline', () => {
        actions.stream.preventReconnect();
        actions.stream.stop();
    })

    actions.manipulator.m = new Manipulator(sockets);
    actions.clupi.c = new Clupi(sockets);
    actions.system = new System(sockets);

    actions.joystick = joystick;
    actions.bounce_uv4l = sockets.bounce_uv4l;


    console.log('[core][actions]:', actions);

    keyboard(actions.motors);

    telemetry(actions, sockets);
};

export default core;
