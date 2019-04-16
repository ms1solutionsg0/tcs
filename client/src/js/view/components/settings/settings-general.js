import { h } from 'hyperapp';

export const SettingsGeneral = ({ state, actions }) =>
    <main>
        {
            state.msiShutdownPending &&
                <div class="modal modal--no-animation" >
                    <div class="modal--background" />
                    <div class="modal--content">
                        <div class="admin-box">
                            <h2><bold>Turtle Rover Shutdown Confirmation</bold></h2>
                            <p><bold>Please manually turn off the rover</bold></p>
                            <button type="button"
                                id="login-btn"
                                class="settings-general__button settings-general__button--large-margin"
                                ontouchstart={() => actions.setMsiShutdownPending(false) && actions.system.shutdown()}
                            >
                                Shutdown
                            </button>
                            <button type="button" 
                                id="login-btn"
                                class="settings-general__button"
                                ontouchstart={() => actions.setMsiShutdownPending(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
        }
        <div class="settings_content">
            <button type='button' class='button' onclick={() => actions.setMsiShutdownPending(true)}>SHUTDOWN</button>
            <button type='button' class='button' onclick={() => actions.system.reboot()}>REBOOT</button>
            <button type='button' class='button' onclick={() => actions.stream.close()}>RESTART STREAM</button>
        </div>
    </main>;
