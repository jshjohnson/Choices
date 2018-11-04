import { expect } from 'chai';
import * as actions from './general';

describe('actions/general', () => {
  describe('setIsLoading action', () => {
    it('returns LOADING action with passed loading flag', () => {
      const expectedAction = {
        type: 'LOADING',
        isLoading: true,
      };

      expect(actions.setIsLoading(true)).to.eql(expectedAction);
    });
  });
});
