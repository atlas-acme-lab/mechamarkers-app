import h from 'snabbdom/h';
import ToolStore from '../DataStore/Tools';
// Undo is annoying bc our data is not immutable and this is hacky
import InputGroupStore from '../DataStore/InputGroups'

export function createButtonState(inputID) {
  return {
    name: `Input ${inputID}`,
    type: 'BUTTON',
    actorID: '', // unset
    detectWindow: 100,
    relativePosition: { distance: 0, angle: 0 }, // unset
  }
}

export function Button(inputID, groupID, inputState, toolState, setInputState, removeInput) {
  const { actorID } = inputState;

  const selectType = ({ target }) => {
    InputGroupStore.storeState();
    inputState.type = target.value;
    InputGroupStore.forceUpdate();
  };
  const typeSelect = h('span.param-value',
    h('select',
      { on: { change: selectType } },
      [
        h('option', { props: { value: 'NONE', disabled: true, } }, 'Select Input Type'),
        h('option', { props: { selected: true, value: 'BUTTON' } }, 'Button'),
        h('option', { props: { value: 'TOGGLE' } }, 'Toggle'),
        h('option', { props: { value: 'KNOB' } }, 'Knob'),
        h('option', { props: { value: 'SLIDER' } }, 'Slider'),
      ]
  ));

  // Input type and name
  const setName = ({ target }) => {
    InputGroupStore.storeState();
    inputState.name = target.value;
    InputGroupStore.forceUpdate();
  };
  const nameField = h('span.param-value.input-name',
    h('input', { on: { change: setName }, props: { value: inputState.name } })
  );
  const inputTypeName = h('li.parameter.input.param-input-type', [typeSelect, nameField]);

  // Actor
  const selectActor = (e) => {
    ToolStore.setProp('toolMode', 'ACTOR_SELECT');
    ToolStore.setProp('targetData', { group: groupID, input: inputID });
  };
  const actor = h(
    'li.parameter.input-group.param-actor',
    [
      h('span.param-type', 'actor ID'),
      h('span.param-value',
        h('input',
          {
            on: { click: selectActor },
            props: { type: 'number', step: 1, value: actorID }
          }
        )
      ),
    ]
  );

  // Detect window
  const setDetectWindow = (e) => {
    InputGroupStore.storeState();
    inputState.detectWindow = e.target.value;
    InputGroupStore.forceUpdate();
  };
  const detectWindow = h(
    'li.parameter.input-group.param-anchor-dw',
    [
      h('span.param-type', 'actor detection window'),
      h('span.param-value',
        h('input',
          {
            on: { change: setDetectWindow },
            props: { type: 'number', step: '1', value: inputState.detectWindow }
          }
        )
      ),
      h('span.param-unit', 'ms'),
    ]
  );

  // Relative Position
  const setRelPos = (e) => {
    ToolStore.setProp('toolMode', 'ACTOR_REL_POS');
    ToolStore.setProp('targetData', { group: groupID, input: inputID });
  };
  const relPos = inputState.relativePosition;
  const relativePosition = h(
    'li.parameter.input-group.param-actor-rp',
    { on: { click: setRelPos } },
    [
      h('span.param-type', 'relative position'),
      h('span.param-value', `d: ${relPos.distance.toFixed(2)} a: ${relPos.angle.toFixed(2)}`),
    ]
  );

  const bulletElement = h('span.bullet', '');
  const removeInputButton = h('button.remove-input', { on: { click: () => removeInput(inputID) } }, 'remove input');

  return h('ul.input-element', [inputTypeName, actor, detectWindow, relativePosition, bulletElement, removeInputButton]);
}
