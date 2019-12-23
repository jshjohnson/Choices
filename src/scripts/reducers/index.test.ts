import { createStore } from 'redux';
import { expect } from 'chai';
import rootReducer from '.';
import groups from './groups';
import choices from './choices';
import items from './items';
import loading from './loading';

describe('reducers/rootReducer', () => {
  const store = createStore(rootReducer);

  it('returns expected reducers', () => {
    const state = store.getState();

    expect(state.groups).to.equal(groups(undefined, {} as any));
    expect(state.choices).to.equal(choices(undefined, {} as any));
    expect(state.items).to.equal(items(undefined, {} as any));
    expect(state.loading).to.equal(loading(undefined, {} as any));
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
        loading: false,
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
