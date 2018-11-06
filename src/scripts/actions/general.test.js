import { expect } from 'chai';
import * as actions from './general';

describe('actions/general', () => {
  describe('setIsLoading action', () => {
    describe('setting loading state to true', () => {
      it('returns expected action', () => {
        const expectedAction = {
          type: 'SET_IS_LOADING',
          isLoading: true,
        };

        expect(actions.setIsLoading(true)).to.eql(expectedAction);
      });
    });

    describe('setting loading state to false', () => {
      it('returns expected action', () => {
        const expectedAction = {
          type: 'SET_IS_LOADING',
          isLoading: false,
        };

        expect(actions.setIsLoading(false)).to.eql(expectedAction);
      });
    });
  });
});
