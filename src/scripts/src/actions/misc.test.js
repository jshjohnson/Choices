import { expect } from 'chai';
import * as actions from './misc';

describe('actions/misc', () => {
  describe('clearAll action', () => {
    it('returns CLEAR_ALL action', () => {
      const expectedAction = {
        type: 'CLEAR_ALL',
      };

      expect(actions.clearAll()).to.eql(expectedAction);
    });
  });
});
