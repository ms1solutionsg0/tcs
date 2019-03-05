import { h } from "hyperapp";

const ADMIN_PINS = ["1337", "1940", "1985"];

const onClickAdmin = (
  msiAdmin,
  setMsiAdmin,
  msiAdminPending,
  setMsiAdminPending
) => {
  const pass = document.getElementById("password").value;
  if (pass && ADMIN_PINS.includes(pass)) {
    setMsiAdmin(!msiAdmin);
  }
  setMsiAdminPending(!msiAdminPending);
};

export default function Modal({ msiAdminPending, setMsiAdminPending, msiAdmin, setMsiAdmin }) {
  return (
    msiAdminPending && (
      <div className="modal">
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
