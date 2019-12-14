import { Action } from 'redux';
import { ACTION_TYPES } from '../constants';
import { Item } from '../interfaces';

export const addItem = ({
  value,
  label,
  id,
  choiceId,
  groupId,
  customProperties,
  placeholder,
  keyCode,
}: Item): Action & Item => ({
  type: ACTION_TYPES.ADD_ITEM,
  value,
  label,
  id,
  choiceId,
  groupId,
  customProperties,
  placeholder,
  keyCode,
});

export const removeItem = (
  id: number,
  choiceId: number,
): Action & { id: number; choiceId: number } => ({
  type: ACTION_TYPES.REMOVE_ITEM,
  id,
  choiceId,
});

export const highlightItem = (
  id: number,
  highlighted: boolean,
): Action & { id: number; highlighted: boolean } => ({
  type: ACTION_TYPES.HIGHLIGHT_ITEM,
  id,
  highlighted,
});
