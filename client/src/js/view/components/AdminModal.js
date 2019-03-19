import { h } from "hyperapp";
import keyboardJS from "keyboardjs";

const ADMIN_PINS = ["1337", "1940", "1985"];
const MODAL_TIMEOUT = 30000; // 30 seconds
let TIMEOUT;

const onClickAdmin = ( msiAdmin, setMsiAdmin, msiAdminPending, setMsiAdminPending, setAdminTimeout, toFullScreen, cancelFullScreen ) => {
  const pass = document.getElementById("password").value;
  if (pass && ADMIN_PINS.includes(pass)) {
    setMsiAdmin(!msiAdmin);
    setAdminTimeout();
  }
  setMsiAdminPending(!msiAdminPending);
  cancelFullScreen();
  toFullScreen();
};

const setModalTimeout = (setMsiAdminPending) => {
  TIMEOUT = setTimeout(() => setMsiAdminPending(false), MODAL_TIMEOUT);
};

const clearModalTimeout = (done) => {
  clearTimeout(TIMEOUT);
  done && done();
};

const resetModalTimeout = (setMsiAdminPending) => {
  clearModalTimeout();
  setModalTimeout(setMsiAdminPending);
};

export default function AdminModal({ msiAdminPending, setMsiAdminPending, msiAdmin, setMsiAdmin, setAdminTimeout, toFullScreen, cancelFullScreen }) {
  keyboardJS.bind("enter", function (e) {
    e.preventDefault();
    e.preventRepeat();
    if (!msiAdminPending) {
      return;
    }

    onClickAdmin(msiAdmin, setMsiAdmin, msiAdminPending, setMsiAdminPending, setAdminTimeout, toFullScreen, cancelFullScreen);
  });

  return (
    msiAdminPending && (
      <div className="modal" oncreate={() => setModalTimeout(setMsiAdminPending)} onremove={(element, done) => clearModalTimeout(done)} >
        <div className="modal--background" />
        <div className="modal--content">
          <div class="admin-box">
            <h2>
              Login for <bold>Administrators</bold> only
            </h2>
            <form class="admin-box__register-form" >
              <input type="password" placeholder="pin/password" id="password" oncreate={element => element.focus()} oninput={() => resetModalTimeout(setMsiAdminPending)} />
              <button
                type="button"
                class="admin-box__register-form--button"
                id="login-btn"
                onclick={() =>
                  onClickAdmin(
                    msiAdmin,
                    setMsiAdmin,
                    msiAdminPending,
                    setMsiAdminPending,
                    setAdminTimeout,
                    toFullScreen,
                    cancelFullScreen
                  )
                }
              >
                Login
              </button>
            </form>
          </div>
        </div>
        <span
          className="modal--close"
          onclick={() => setMsiAdminPending(!msiAdminPending) && cancelFullScreen() && toFullScreen()}
          role="button"
          tabIndex={0}
        >
          &times;
        </span>
      </div>
    )
  );
}
