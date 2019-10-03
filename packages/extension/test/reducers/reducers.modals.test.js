import reducer from '../../src/reducers/modals';
import {initialState} from '../../src/reducers/modals';
import {types} from '../../src/actions/action_types';
import * as C from '../../src/common/constant';

describe('modals reducer', () => {
  ['playLoop', 'settings', 'duplicate', 'shareBlock', 'rename', 'projectSetup', 'browser', 'multiselect', 'save'].forEach(m => {
    it(`should open ${m} modal`, () => {
      const action = {
        type: types.MODAL_STATE,
        modal: m,
        state: true
      };
      const expected = Object.assign({},
        initialState, {
          [m]: true
        }
      )
      expect(reducer(initialState, action)).toEqual(expected);
    });
    it(`should close ${m} modal`, () => {
      const init = Object.assign({}, initialState, {[m]: true})
      const action = {
        type: types.MODAL_STATE,
        modal: m,
        state: false
      };
      const expected = Object.assign({},
        initialState, {
          [m]: false
        }
      )
      expect(reducer(initialState, action)).toEqual(expected);
    });
  })
  it('should do nothing if invalid action', () => {
    const action = {
      type: 'INVALID'
    };
    const expected = Object.assign({},
      initialState
    )
    expect(reducer(initialState, action)).toEqual(expected);
  })
});
