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

  describe('resetTo action', () => {
    it('returns RESET_TO action', () => {
      const state = { test: true };
      const expectedAction = {
        type: 'RESET_TO',
        state,
      };

      expect(actions.resetTo(state)).to.eql(expectedAction);
    });
  });

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
