import { ACTION_TYPES } from '../constants';

/**
 * @typedef {import('redux').Action} Action
 * @typedef {import('../../../types/index').Choices.Group} Group
 */

/**
 * @param {Group} group
 * @returns {Action & Group}
 */
export const addGroup = ({ value, id, active, disabled }) => ({
  type: ACTION_TYPES.ADD_GROUP,
  value,
  id,
  active,
  disabled,
});
