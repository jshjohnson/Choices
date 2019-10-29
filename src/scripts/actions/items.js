import { ACTION_TYPES } from '../constants';

export const addItem = ({
  value,
  label,
  id,
  choiceId,
  groupId,
  customProperties,
  placeholder,
  keyCode,
}) => ({
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

export const removeItem = (id, choiceId) => ({
  type: ACTION_TYPES.REMOVE_ITEM,
  id,
  choiceId,
});

export const highlightItem = (id, highlighted) => ({
  type: ACTION_TYPES.HIGHLIGHT_ITEM,
  id,
  highlighted,
});
