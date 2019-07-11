import { h } from "hyperapp";

import Numpad from "./Numpad";

const ADMIN_PINS = ["1933", "1337"];
const MODAL_TIMEOUT = 30000; // 30 seconds
let TIMEOUT;

const onClickAdmin = ( msiAdmin, setMsiAdmin, msiAdminPending, setMsiAdminPending, setAdminTimeout ) => {
  const pass = document.getElementById("password").value;
  if (pass && ADMIN_PINS.includes(pass)) {
    setMsiAdmin(!msiAdmin);
    setAdminTimeout();
  }
  setMsiAdminPending(!msiAdminPending);
};

const setModalTimeout = (setMsiAdminPending) => {
  TIMEOUT = setTimeout(() => setMsiAdminPending(false), MODAL_TIMEOUT);
};

const clearModalTimeout = (element, done) => {
  clearTimeout(TIMEOUT);
  if (element) {
    element.classList.add("modal--remove");
  }

  done && setTimeout(() => done(), 500);
};

const resetModalTimeout = (setMsiAdminPending) => {
  clearModalTimeout();
  setModalTimeout(setMsiAdminPending);
};

export default function AdminModal({ msiAdminPending, setMsiAdminPending, msiAdmin, setMsiAdmin, setAdminTimeout }) {
  
  const onKeyClick = (event) => {
    const input = document.getElementById("password");
    input.value += event.target.innerText;
    resetModalTimeout(setMsiAdminPending);
  }
  
  const onKeyClear = () => {
    document.getElementById("password").value = "";
  }

  return (
    msiAdminPending && (
      <div class="modal" oncreate={() => setModalTimeout(setMsiAdminPending)} onremove={(element, done) => clearModalTimeout(element, done)} >
        <div class="modal--background" />
        <div class="modal--content">
          <div class="admin-box">
            <h2>
              Login for <bold>Administrators</bold> only
            </h2>
            <form class="admin-box__register-form" >
              <input type="password" placeholder="pin" id="password" readonly />
              <button
                type="button"
                class="admin-box__register-form--button"
                id="login-btn"
                ontouchstart={() =>
                  onClickAdmin(
                    msiAdmin,
                    setMsiAdmin,
                    msiAdminPending,
                    setMsiAdminPending,
                    setAdminTimeout
                  )
                }
              >
                Login
              </button>
            </form>
          </div>
          <Numpad onKeyClick={onKeyClick} onKeyClear={onKeyClear} />
        </div>
        <span
          class="modal--close"
          ontouchstart={() => setMsiAdminPending(!msiAdminPending)}
          role="button"
          tabIndex={0}
        >
          &times;
        </span>
      </div>
    )
  );
}
