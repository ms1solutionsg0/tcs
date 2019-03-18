import { h } from 'hyperapp';

const TOUCH_BOX_SIZE = 200;
const QUADRANTS = {
	TOP_LEFT: 1,
	TOP_RIGHT: 2,
	BOTTOM_LEFT: 3,
	BOTTOM_RIGHT: 4
};
const TOUCH_ORDER = [QUADRANTS.TOP_LEFT, QUADRANTS.BOTTOM_LEFT, QUADRANTS.TOP_LEFT];

let quadrantQueue = [];

function isTopLeft(x, y) {
	return x <= TOUCH_BOX_SIZE && y <= TOUCH_BOX_SIZE;
}

function isTopRight(x, y) {
	return x >= screen.width - TOUCH_BOX_SIZE && y <= TOUCH_BOX_SIZE;
}

function isBottomLeft(x, y) {
	return x <= TOUCH_BOX_SIZE && y >= screen.height - TOUCH_BOX_SIZE;
}

function isBottomRight(x, y) {
	return x >= screen.width - TOUCH_BOX_SIZE && y >= screen.height - TOUCH_BOX_SIZE;
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
		const { clientX, clientY } = evt;
		const quadrant = getQuadrant(clientX, clientY);

		if (quadrant) {
			quadrantQueue.push(quadrant);

			if (isEqual(quadrantQueue, TOUCH_ORDER)) {
				quadrantQueue = [];
				msiAdmin ? setMsiAdmin(!msiAdmin) && clearAdminTimeout() : setMsiAdminPending(!msiAdminPending);
				quadrantQueue = [];
			}

			if (quadrantQueue.length > TOUCH_ORDER.length) {
				quadrantQueue = [];
			}
		}
	}

	return (
		<div class="touch-container" onclick={clickHandler}>
			{children}
		</div>
	);
}
