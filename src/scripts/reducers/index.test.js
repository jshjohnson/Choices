import { createStore } from 'redux';
import { expect } from 'chai';
import rootReducer from './index';
import groups from './groups';
import choices from './choices';
import items from './items';

describe('reducers/rootReducer', () => {
  const store = createStore(rootReducer);

  it('returns expected reducers', () => {
    const state = store.getState();

    expect(state.groups).to.equal(groups(undefined, {}));
    expect(state.choices).to.equal(choices(undefined, {}));
    expect(state.items).to.equal(items(undefined, {}));
  });

  describe('CLEAR_ALL', () => {
    it('resets state', () => {
      const output = rootReducer(
        {
          items: [1, 2, 3],
          groups: [1, 2, 3],
          choices: [1, 2, 3],
        },
        {
          type: 'CLEAR_ALL',
        },
      );

      expect(output).to.eql({
        items: [],
        groups: [],
        choices: [],
        general: {
          loading: false,
        },
      });
    });
  });

  describe('RESET_TO', () => {
    it('replaces state with given state', () => {
      const output = rootReducer(
        {
          items: [1, 2, 3],
          groups: [1, 2, 3],
          choices: [1, 2, 3],
        },
        {
          type: 'RESET_TO',
          state: {},
        },
      );

      expect(output).to.eql({});
    });
  });
});
