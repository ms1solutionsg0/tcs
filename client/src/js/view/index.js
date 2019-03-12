import { h } from "hyperapp";

import { Rotate } from "./rotate";
import { SplashScreen } from "./splashscreen";
import { TopBar } from "./components/topbar";
import { Stream } from "./components/stream";
import { Settings } from "./components/settings";
import { Manipulator } from "./components/manipulator";
import { Joystick } from "./components/joystick";
// import { Gripper } from "./components/gripper";
// import { ModeChooser } from "./components/modechooser";
// import { Clupi } from "./components/clupi";
import TouchHandler from "./components/TouchHandler";
import AdminModal from "./components/AdminModal";

const view = (state, actions) => (
  <main>
    <section>
      <AdminModal
        msiAdminPending={state.msiAdminPending}
        setMsiAdminPending={actions.setMsiAdminPending}
        msiAdmin={state.msiAdmin}
        setMsiAdmin={actions.setMsiAdmin}
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
      {/* <div class="controls-box-left">
        <Clupi state={state} actions={actions} />
        <Gripper
          mode={state.mode}
          state={state.manipulator.gripper}
          action={actions.manipulator}
        />
        {state.msiAdmin && (
          <ModeChooser mode={state.mode} setMode={actions.setMode} />
        )}
      </div> */}
      <Stream stream={actions.stream} mode={state.mode} />
    </div>
  </main>
);

export default view;
