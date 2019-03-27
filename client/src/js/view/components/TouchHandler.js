import { h } from 'hyperapp';

const TOUCH_BOX_SIZE = 200;
const QUADRANTS = {
	TOP_LEFT: 1,
	TOP_RIGHT: 2,
	BOTTOM_LEFT: 3,
	BOTTOM_RIGHT: 4,
	MIDDLE_LEFT: 5,
};
const { width, height } = screen;
const halfHeight = height / 2;
const halfWidth = width / 2;
const halfTouchBoxSize = TOUCH_BOX_SIZE / 2;

const TOUCH_ORDER = [QUADRANTS.MIDDLE_LEFT, QUADRANTS.MIDDLE_LEFT, QUADRANTS.MIDDLE_LEFT, QUADRANTS.MIDDLE_LEFT];

let quadrantQueue = [...TOUCH_ORDER];
let touchTimeout;

function isTopLeft(x, y) {
	return x <= TOUCH_BOX_SIZE && y <= TOUCH_BOX_SIZE;
}

function isTopRight(x, y) {
	return x >= width - TOUCH_BOX_SIZE && y <= TOUCH_BOX_SIZE;
}

function isBottomLeft(x, y) {
	return x <= TOUCH_BOX_SIZE && y >= height - TOUCH_BOX_SIZE;
}

function isBottomRight(x, y) {
	return x >= width - TOUCH_BOX_SIZE && y >= height - TOUCH_BOX_SIZE;
}

function isMiddleLeft(x, y) {
	return x <= TOUCH_BOX_SIZE && (y >= (halfHeight - halfTouchBoxSize) && y <= (halfHeight + halfTouchBoxSize));
}

function getQuadrant(x, y) {
	if (isTopLeft(x, y)) {
		return QUADRANTS.TOP_LEFT;
	} else if (isTopRight(x, y)) {
		return QUADRANTS.TOP_RIGHT;
	} else if (isBottomLeft(x, y)) {
		return QUADRANTS.BOTTOM_LEFT;
	} else if (isBottomRight(x, y)) {
		return QUADRANTS.BOTTOM_RIGHT;
	} else if (isMiddleLeft(x, y)) {
		return QUADRANTS.MIDDLE_LEFT;
	}

	return 0;
}

function isEqual(arr1, arr2) {
	const len1 = arr1.length;
	const len2 = arr2.length;

	if (len1 != len2) {
		return false;
	}

	for (let i = 0; i < len1; i++) {
		if (arr1[i] != arr2[i]) {
			return false;
		}
	}

	return true;
}

export default function TouchHandler({ msiAdmin, setMsiAdmin, msiAdminPending, setMsiAdminPending, clearAdminTimeout }, children) {
	function clickHandler(evt) {
		const { clientX, clientY } = evt.changedTouches[0];
		const quadrant = getQuadrant(clientX, clientY);

		if (quadrant) {
			if (quadrantQueue.length && quadrantQueue[0] === quadrant) {
				quadrantQueue.shift();
				if (quadrantQueue.length === 0) {
					quadrantQueue = [...TOUCH_ORDER];
					msiAdmin ? setMsiAdmin(!msiAdmin) && clearAdminTimeout() : setMsiAdminPending(!msiAdminPending);
					return;
				}
			}

			clearTimeout(touchTimeout);
			setTimeout(() => {
				quadrantQueue = [...TOUCH_ORDER];
			}, 5000);
		}
	}

	return (
		<div class="touch-container" ontouchstart={clickHandler}>
			{children}
		</div>
	);
}
