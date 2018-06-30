import { h } from 'hyperapp'


export const ModeChooser = ()  => 
    <div class="mode-switcher">

        <label class="radio">
            <input id="mode_grab" type="radio" name="mode-switch" value="grab"/>
            <span class="outer">
                <span class="inner"></span>
            </span>
            GRAB
        </label>

        <label class="radio">
            <input id="mode_drive" type="radio" name="mode-switch" checked value="drive"/>
            <span class="outer">
                <span class="inner"></span>
            </span>
            DRIVE
        </label>

    </div>