let state = {
  saveHeld: false,
  saveCount: 0,
  SAVE_COUNT_MAX: 1200,
};
const stateListeners = [];

function propogate() {
  stateListeners.forEach(l => l(state));
}

export default {
  getState: () => state,
  setProp: (prop, value) => {
    state[prop] = value;
    propogate();
  },
  forceUpdate: () => {
    propogate();
  },
  subscribe: (listener) => {
    stateListeners.push(listener);
    listener(state);
  },
}
