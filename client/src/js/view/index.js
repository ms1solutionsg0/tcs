import { h } from "hyperapp";

import { Rotate } from "./rotate";
import { SplashScreen } from "./splashscreen";
import { TopBar } from "./components/topbar";
import { Stream } from "./components/stream";
import { Settings } from "./components/settings";
import { Manipulator } from "./components/manipulator";
import { Joystick } from "./components/joystick";
import TouchHandler from "./components/TouchHandler";
import AdminModal from "./components/AdminModal";

const ADMIN_TIMEOUT_TIME = 150000; // 2.5 minutes
let ADMIN_TIMEOUT;

const view = (state, actions) => {
  const setAdminTimeout = () => {
    ADMIN_TIMEOUT = setTimeout(() => actions.setMsiAdmin(false), ADMIN_TIMEOUT_TIME);
  };

  const clearAdminTimeout = () => {
    clearTimeout(ADMIN_TIMEOUT);
  }

  const toFullScreen = (element = document.documentElement) => {
    const isFullscreen =
      (document.fullScreenElement && document.fullScreenElement !== null) ||
      (document.mozFullScreen || document.webkitIsFullScreen) ||
      false;

    if (isFullscreen) {
      return;
    }

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  };

  const cancelFullScreen = () => {
    const isFullscreen =
      (document.fullScreenElement && document.fullScreenElement !== null) ||
      (document.mozFullScreen || document.webkitIsFullScreen) ||
      false;

    if (!isFullscreen) {
      return;
    }

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  return (
    <main>
      {
        Object.onload = toFullScreen()
      }
      <section>
        <AdminModal
          msiAdminPending={state.msiAdminPending}
          setMsiAdminPending={actions.setMsiAdminPending}
          msiAdmin={state.msiAdmin}
          setMsiAdmin={actions.setMsiAdmin}
          setAdminTimeout={setAdminTimeout}
          toFullScreen={toFullScreen}
          cancelFullScreen={cancelFullScreen}
        />
      </section>
      <Rotate />
      <SplashScreen state={state.showSplashScreen} />
      <div id="wrapper" class="wrapper">
        <TouchHandler
          msiAdmin={state.msiAdmin}
          setMsiAdmin={actions.setMsiAdmin}
          msiAdminPending={state.msiAdminPending}
          setMsiAdminPending={actions.setMsiAdminPending}
          clearAdminTimeout={clearAdminTimeout}
        />
        <TopBar
          msiAdmin={state.msiAdmin}
          state={state.telemetry}
          switchSettings={actions.settings.setVisibility}
          toFullScreen={toFullScreen}
          cancelFullScreen={cancelFullScreen}
        />
        <section>
          {state.msiAdmin && <Settings state={state} actions={actions} />}
        </section>
        <div class="crosshair" />
        <div class="dots" />
        <div class="controls-box-right">
          <Manipulator
            mode={state.mode}
            state={state.manipulator}
            action={actions.manipulator}
          />
          <Joystick
            mode={state.mode}
            joystick={actions.joystick}
            motors={actions.motors}
          />
        </div>
        <Stream stream={actions.stream} mode={state.mode} />
      </div>
    </main>
  );
};

export default view;
