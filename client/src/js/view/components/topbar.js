import { h } from 'hyperapp';

export const TopBar = ({ msiAdmin, state, switchSettings }) =>
    <section id="topbar" class="topbar">
        <img alt="" class="topbar_logo" src={require('../../../img/ui/turtle-logo.svg')} />
        <div class="topbar_indicators">
            <IndicatorBattery batteryLevel={state.batteryLevel} />
            {msiAdmin && <IndicatorSignal signalLevel={state.signalLevel} />}
        </div>
        {
            msiAdmin &&
            <div role="button" class="topbar_menu" onmousedown={() => switchSettings()}>
                <div class="topbar_menu_bar" />
            </div>
        }
    </section>;

const IndicatorBattery = ({ batteryLevel }) =>
    <img alt="" id="indicator-battery" class="topbar_indicators_indicator" src={batteryLevelIcon(batteryLevel)} />;

const IndicatorSignal = ({ signalLevel }) =>
    <img alt="" id="indicator-signal" class="topbar_indicators_indicator" src={signalLevelIcon(signalLevel)} />;


const batteryLevelIcon = (batteryLevel) => {
    if ((batteryLevel >= 19.5) === (batteryLevel < 21.5)) {
        return require('../../../img/ui/battery-1.svg');
    } else if ((batteryLevel >= 21.5) === (batteryLevel < 23)) {
        return require('../../../img/ui/battery-2.svg');
    } else if ((batteryLevel >= 23) === (batteryLevel < 24)) {
        return require('../../../img/ui/battery-3.svg');
    } else if (batteryLevel >= 24) {
        return require('../../../img/ui/battery-4.svg');
    } else {
        return require('../../../img/ui/battery-0.svg');
    }
};

const signalLevelIcon = (signalLevel) => {
    if ((signalLevel >= 80) === (signalLevel < 85)) {
        return require('../../../img/ui/signal-1.svg');
    } else if ((signalLevel >= 85) === (signalLevel < 90)) {
        return require('../../../img/ui/signal-2.svg');
    } else if ((signalLevel >= 90) === (signalLevel < 95)) {
        return require('../../../img/ui/signal-3.svg');
    } else if (signalLevel >= 95) {
        return require('../../../img/ui/signal-4.svg');
    } else {
        return require('../../../img/ui/signal-0.svg');
    }
};
