import { app } from 'hyperapp';
import { cloneDeep } from 'lodash';
import actions from './actions';
import state from './state';
import view from './view';

import { hyperlog } from './utils/logger';
import core from './core';

const defaultState = cloneDeep(state);
delete defaultState.default;
state.default = defaultState;

const wiredActions = hyperlog(app)(state, actions, view, document.body);

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        wiredActions.restoreState();
        wiredActions.setSplashScreenState(false);
        console.log(wiredActions);
    }
};

core(wiredActions);

