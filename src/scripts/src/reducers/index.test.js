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
});
