import { expect } from 'chai';
import groups, { defaultState } from './groups';

describe('reducers/groups', () => {
  it('should return same state when no action matches', () => {
    expect(groups(defaultState, {} as any)).to.equal(defaultState);
  });

  describe('when groups do not exist', () => {
    describe('ADD_GROUP', () => {
      it('adds group', () => {
        const id = 1;
        const value = 'Group one';
        const active = true;
        const disabled = false;

        const expectedResponse = [
          {
            id,
            value,
            active,
            disabled,
          },
        ];

        const actualResponse = groups(undefined, {
          type: 'ADD_GROUP',
          id,
          value,
          active,
          disabled,
        });

        expect(actualResponse).to.eql(expectedResponse);
      });
    });
  });

  describe('when groups exist', () => {
    let state;

    beforeEach(() => {
      state = [
        {
          id: 1,
          value: 'Group one',
          active: true,
          disabled: false,
        },
        {
          id: 2,
          value: 'Group two',
          active: true,
          disabled: false,
        },
      ];
    });

    describe('CLEAR_CHOICES', () => {
      it('restores to defaultState', () => {
        const clonedState = state.slice(0);
        const expectedResponse = defaultState;
        const actualResponse = groups(clonedState, {
          type: 'CLEAR_CHOICES',
        });

        expect(actualResponse).to.eql(expectedResponse);
      });
    });
  });
});
