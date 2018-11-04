import { expect } from 'chai';
import general, { defaultState } from './general';

describe('reducers/general', () => {
  it('should return same state when no action matches', () => {
    expect(general(defaultState, {})).to.equal(defaultState);
  });

  describe('LOADING', () => {
    it('sets loading state', () => {
      const expectedState = {
        loading: true,
      };

      const actualState = general(undefined, {
        type: 'LOADING',
        isLoading: true,
      });

      expect(expectedState).to.eql(actualState);
    });
  });
});
