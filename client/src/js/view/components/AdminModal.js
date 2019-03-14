import { h } from "hyperapp";
import keyboardJS from "keyboardjs";

const ADMIN_PINS = ["1337", "1940", "1985"];
const MODAL_TIMEOUT = 30000;

const onClickAdmin = ( msiAdmin, setMsiAdmin, msiAdminPending, setMsiAdminPending ) => {
  const pass = document.getElementById("password").value;
  if (pass && ADMIN_PINS.includes(pass)) {
    setMsiAdmin(!msiAdmin);
  }
  setMsiAdminPending(!msiAdminPending);
};

const timeoutModal = setMsiAdminPending => {
  setTimeout(() => setMsiAdminPending(false), MODAL_TIMEOUT);
};

export default function AdminModal({ msiAdminPending, setMsiAdminPending, msiAdmin, setMsiAdmin }) {
  keyboardJS.bind("enter", function (e) {
    e.preventDefault();
    e.preventRepeat();
    if (!msiAdminPending) {
      return;
    }

    onClickAdmin(msiAdmin, setMsiAdmin, msiAdminPending, setMsiAdminPending);
  });

  return (
    msiAdminPending && (
      <div className="modal" oncreate={() => timeoutModal(setMsiAdminPending)}>
        <div className="modal--background" />
        <div className="modal--content">
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
                onclick={() =>
                  onClickAdmin(
                    msiAdmin,
                    setMsiAdmin,
                    msiAdminPending,
                    setMsiAdminPending
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
          onclick={() => setMsiAdminPending(!msiAdminPending)}
          role="button"
          tabIndex={0}
        >
          &times;
        </span>
      </div>
    )
  );
}
