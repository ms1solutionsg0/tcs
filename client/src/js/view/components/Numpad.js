import { h } from "hyperapp";

export default function Numpad({ onKeyClick, onKeyClear }) {
  return (
    <div className="numpad">
      <div className="row">
        <button className="col-1-of-3 numpad__key" ontouchstart={onKeyClick}>7</button>
        <button className="col-1-of-3 numpad__key" ontouchstart={onKeyClick}>8</button>
        <button className="col-1-of-3 numpad__key" ontouchstart={onKeyClick}>9</button>
      </div>
      <div className="row">
        <button className="col-1-of-3 numpad__key" ontouchstart={onKeyClick}>4</button>
        <button className="col-1-of-3 numpad__key" ontouchstart={onKeyClick}>5</button>
        <button className="col-1-of-3 numpad__key" ontouchstart={onKeyClick}>6</button>
      </div>
      <div className="row">
        <button className="col-1-of-3 numpad__key" ontouchstart={onKeyClick}>1</button>
        <button className="col-1-of-3 numpad__key" ontouchstart={onKeyClick}>2</button>
        <button className="col-1-of-3 numpad__key" ontouchstart={onKeyClick}>3</button>
      </div>
      <div className="row">
        <button className="col-2-of-3 numpad__key" ontouchstart={onKeyClick}>0</button>
        <button className="col-1-of-3 numpad__key numpad__key--clear" ontouchstart={onKeyClear}>clear</button>
      </div>
    </div>
  );
}
