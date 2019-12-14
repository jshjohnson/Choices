import { expect } from 'chai';
import * as actions from './groups';

describe('actions/groups', () => {
  describe('addGroup action', () => {
    it('returns ADD_GROUP action', () => {
      const value = 'test';
      const id = 'test';
      const active = true;
      const disabled = false;
      const expectedAction = {
        type: 'ADD_GROUP',
        value,
        id,
        active,
        disabled,
      };

      expect(actions.addGroup({ value, id, active, disabled })).to.eql(
        expectedAction,
      );
    });
  });
});
