import { h } from 'hyperapp';

export const Joystick = ({ mode, joystick, motors, preventFlip }) =>
    <div class='joystick' oncreate={(el) => joystick({ el, motors, preventFlip })}>
        <img alt="" class='joystick__image' src={require('../../../img/ui/joystick.svg')} />
    </div>;
