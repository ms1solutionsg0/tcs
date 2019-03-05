import { h } from "hyperapp";

export default function Modal({ msiAdminPending, setMsiAdminPending }, children) {
    return (
        msiAdminPending &&
            (<div className="modal">
            <div className="modal--background" />
            <div className="modal--content">{children}</div>
            <span
                className="modal--close"
                onclick={() => setMsiAdminPending(!msiAdminPending)}
                role="button"
                tabIndex={0}
            >
                &times;
      </span>
        </div>)
    );
};
