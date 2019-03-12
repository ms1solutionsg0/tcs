import { h } from 'hyperapp';

export const SettingsGeneral = ({ actions }) =>
    <div class="settings_content">
        <button type='button' class='button' onclick={() => actions.shutdown()}>SHUTDOWN</button>
        <button type='button' class='button' onclick={() => actions.reboot()}>REBOOT</button>
        <button type='button' class='button' onclick={() => location.reload()}>RESTART STREAM</button>
    </div>;
