import { h } from 'hyperapp';

export const SettingsGeneral = ({ actions }) =>
    <div class="settings_content">
        <button type='button' class='button' onclick={() => actions.system.shutdown()}>SHUTDOWN</button>
        <button type='button' class='button' onclick={() => actions.system.reboot()}>REBOOT</button>
        <button type='button' class='button' onclick={() => actions.stream.reconnect()}>RESTART STREAM</button>
    </div>;
