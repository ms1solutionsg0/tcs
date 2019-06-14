import { h } from "hyperapp";

// import { SplashScreen } from "./splashscreen";
import { TopBar } from "./components/topbar";
import { Stream } from "./components/stream";
import { Settings } from "./components/settings";
import { Manipulator } from "./components/manipulator";
import { Joystick } from "./components/joystick";
import TouchHandler from "./components/TouchHandler";
import AdminModal from "./components/AdminModal";

const ADMIN_TIMEOUT_TIME = 150000; // 2.5 minutes
let ADMIN_TIMEOUT;
const STREAM_REFRESH_TIME = 900000; // 15 minutes
let PREVENT_FLIP_INTERVAL;


const view = (state, actions) => {

  const onRefreshStreamRemove = (element, done) => {
    element.classList.add("modal-stream--remove");
    done && setTimeout(() => done(), 1000);
  }

  const onPreventFlipRemove = (element, done) => {
    // clearInterval(PREVENT_FLIP_INTERVAL);
    // NEAL TODO
    element.classList.add("modal-stream--remove__preventFlip");
    done && setTimeout(() => done(), 1000);
  }

  const setPreventFlipInterval = (element) => {
    return;
    // NEAL TODO
    clearInterval(PREVENT_FLIP_INTERVAL);
    PREVENT_FLIP_INTERVAL = setInterval(() => element.classList.toggle("modal-stream--remove__preventFlip"), 3000);
  }

  const setAdminTimeout = () => {
    ADMIN_TIMEOUT = setTimeout(() => actions.setMsiAdmin(false), ADMIN_TIMEOUT_TIME);
  };

  const clearAdminTimeout = () => {
    clearTimeout(ADMIN_TIMEOUT);
  }

  const setStreamRefreshInterval = () => {
    setInterval(() => { actions.setMsiStreamRefreshPending(true); actions.stream.close(); }, STREAM_REFRESH_TIME);
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
    <main oncreate={() => {setStreamRefreshInterval(); toFullScreen()}}>
      <section>
        <AdminModal
          msiAdminPending={state.msiAdminPending}
          setMsiAdminPending={actions.setMsiAdminPending}
          msiAdmin={state.msiAdmin}
          setMsiAdmin={actions.setMsiAdmin}
          setAdminTimeout={setAdminTimeout}
        />
      </section>
      <div id="wrapper" class="wrapper">
        <TouchHandler
          msiAdmin={state.msiAdmin}
          setMsiAdmin={actions.setMsiAdmin}
          msiAdminPending={state.msiAdminPending}
          setMsiAdminPending={actions.setMsiAdminPending}
          clearAdminTimeout={clearAdminTimeout}
        />
        <section>
          {
            state.msiStreamRefreshPending &&
            <div class="modal-stream" onremove={(element, done) => onRefreshStreamRemove(element, done)}>
              <h2 class="modal-stream--message">{"Interference from Mars!\nRetrieving Connection "}&#9732;</h2>
            </div>
          }
        </section>
        <section>
          {
            state.preventFlipForward &&
            <div class="modal-stream modal-stream--preventFlip" oncreate={(element) => setPreventFlipInterval(element)} onremove={(element, done) => onPreventFlipRemove(element, done)}>
              <h2 class="modal-stream--message">{"Rover Malfunction! Please move backwards! "}&#9888;</h2>
            </div>
          }
        </section>
        <section>
          {
            state.preventFlipBackward &&
            <div class="modal-stream modal-stream--preventFlip" oncreate={(element) => setPreventFlipInterval(element)} onremove={(element, done) => onPreventFlipRemove(element, done)}>
              <h2 class="modal-stream--message">{"Rover Malfunction! Please move forwards! "}&#9888;</h2>
            </div>
          }
        </section>
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
