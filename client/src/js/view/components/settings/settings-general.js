import { h } from 'hyperapp';

export const SettingsGeneral = ({ system }) =>
    <div class="settings_content">
        <button type='button' class='button' onclick={() => system.shutdown()}>SHUTDOWN</button>
        <button type='button' class='button' onclick={() => system.reboot()}>REBOOT</button>
        <button type='button' class='button' onclick={() => location.reload()}>RESTART STREAM</button>
    </div>;
