import { h } from 'hyperapp';

export const SettingsGeneral = ({ actions }) =>
    <div class="settings_content">
        <button type='button' class='button' onClick={() => actions.system.shutdown()}>SHUTDOWN</button>
        <button type='button' class='button' onClick={() => actions.system.reboot()}>REBOOT</button>
        <button type='button' class='button' onClick={() => actions.stream.start()}>RESTART STREAM</button>
    </div>;
