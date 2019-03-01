import { h } from "hyperapp";

import { Rotate } from "./rotate";
import { SplashScreen } from "./splashscreen";
import { TopBar } from "./components/topbar";
import { Stream } from "./components/stream";
import { Settings } from "./components/settings";
import { Manipulator } from "./components/manipulator";
import { Joystick } from "./components/joystick";
import { Gripper } from "./components/gripper";
import { ModeChooser } from "./components/modechooser";
import { Clupi } from "./components/clupi";
import TouchHandler from "./components/TouchHandler";
import Modal from "./components/Modal";

const ADMIN_PINS = ["1337", "1940", "1985"];

const adminBox = (state, actions) => {
  return (
    <div class="admin-box">
      <h2>
        Login for <bold>Administrators</bold> only
      </h2>
      <form class="admin-box__register-form">
        <input type="password" placeholder="pin/password" id="password" />
        <button
          type="button"
          class="admin-box__register-form--button"
          id="login-btn"
          onclick={() => onClickAdmin(state, actions)}
        >
          Login
        </button>
      </form>
    </div>
  );
};

const onClickAdmin = (state, actions) => {
  const pass = document.getElementById("password").value;
  if (pass && ADMIN_PINS.includes(pass)) {
    actions.setMsiAdmin(!state.msiAdmin);
  }
  actions.setMsiAdminPending(!state.msiAdminPending);
};

const view = (state, actions) => (
  <main>
    <section>
      {state.msiAdminPending && (
        <Modal
          msiAdminPending={state.msiAdminPending}
          setMsiAdminPending={actions.setMsiAdminPending}
        >
          {adminBox(state, actions)}
        </Modal>
      )}
    </section>
    <Rotate />
    <SplashScreen state={state.showSplashScreen} />
    <div id="wrapper" class="wrapper">
      <TouchHandler
        msiAdmin={state.msiAdmin}
        setMsiAdmin={actions.setMsiAdmin}
        msiAdminPending={state.msiAdminPending}
        setMsiAdminPending={actions.setMsiAdminPending}
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
      <div class="controls-box-left">
        <Clupi state={state} actions={actions} />
        <Gripper
          mode={state.mode}
          state={state.manipulator.gripper}
          action={actions.manipulator}
        />
        {state.msiAdmin && (
          <ModeChooser mode={state.mode} setMode={actions.setMode} />
        )}
      </div>
      <Stream stream={actions.stream} mode={state.mode} />
    </div>
  </main>
);

export default view;
