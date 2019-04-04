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
// const STREAM_REFRESH_TIME = 900000; // 15 minutes
const STREAM_REFRESH_TIME = 60000; // 1 minute TODO


const view = (state, actions) => {
  const setAdminTimeout = () => {
    ADMIN_TIMEOUT = setTimeout(() => actions.setMsiAdmin(false), ADMIN_TIMEOUT_TIME);
  };

  const clearAdminTimeout = () => {
    clearTimeout(ADMIN_TIMEOUT);
  }

  const setStreamRefreshInterval = () => {
    setInterval(() => actions.stream.close(), STREAM_REFRESH_TIME);
  };

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

  return (
    <main oncreate={() => setStreamRefreshInterval()}>
      {
        Object.onload = toFullScreen()
      }
      {
        state.msiStreamRefreshPending &&
        <div class="refresh-stream">Neal</div>
      }
      <section>
        <AdminModal
          msiAdminPending={state.msiAdminPending}
          setMsiAdminPending={actions.setMsiAdminPending}
          msiAdmin={state.msiAdmin}
          setMsiAdmin={actions.setMsiAdmin}
          setAdminTimeout={setAdminTimeout}
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
