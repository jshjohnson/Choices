import { expect } from 'chai';
import * as actions from './items';

describe('actions/items', () => {
  describe('addItem action', () => {
    it('returns ADD_ITEM action', () => {
      const value = 'test';
      const label = 'test';
      const id = '1234';
      const choiceId = '1234';
      const groupId = 'test';
      const customProperties = { test: true };
      const placeholder = true;
      const keyCode = 10;

      const expectedAction = {
        type: 'ADD_ITEM',
        value,
        label,
        id,
        choiceId,
        groupId,
        customProperties,
        placeholder,
        keyCode,
      };

      expect(
        actions.addItem({
          value,
          label,
          id,
          choiceId,
          groupId,
          customProperties,
          placeholder,
          keyCode,
        }),
      ).to.eql(expectedAction);
    });
  });

  describe('removeItem action', () => {
    it('returns REMOVE_ITEM action', () => {
      const id = '1234';
      const choiceId = '1';
      const expectedAction = {
        type: 'REMOVE_ITEM',
        id,
        choiceId,
      };

      expect(actions.removeItem(id, choiceId)).to.eql(expectedAction);
    });
  });

  describe('highlightItem action', () => {
    it('returns HIGHLIGHT_ITEM action', () => {
      const id = '1234';
      const highlighted = true;

      const expectedAction = {
        type: 'HIGHLIGHT_ITEM',
        id,
        highlighted,
      };

      expect(actions.highlightItem(id, highlighted)).to.eql(expectedAction);
    });
  });
});
