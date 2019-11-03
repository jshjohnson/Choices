import { ACTION_TYPES } from '../constants';

/**
 * @typedef {import('redux').Action} Action
 * @typedef {import('../../../types/index').Choices.Item} Item
 */

/**
 * @param {Item} item
 * @returns {Action & Item}
 */
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

/**
 * @param {string} id
 * @param {string} choiceId
 * @returns {Action & { id: string, choiceId: string }}
 */
export const removeItem = (id, choiceId) => ({
  type: ACTION_TYPES.REMOVE_ITEM,
  id,
  choiceId,
});

/**
 * @param {string} id
 * @param {boolean} highlighted
 * @returns {Action & { id: string, highlighted: boolean }}
 */
export const highlightItem = (id, highlighted) => ({
  type: ACTION_TYPES.HIGHLIGHT_ITEM,
  id,
  highlighted,
});
