/**
 * @typedef {import('redux').Action} Action
 * @typedef {import('../../../types/index').Choices.Choice} Choice
 */

import { ACTION_TYPES } from '../constants';

/**
 * @argument {Choice} choice
 * @returns {Action & Choice}
 */
export const addChoice = ({
  value,
  label,
  id,
  groupId,
  disabled,
  elementId,
  customProperties,
  placeholder,
  keyCode,
}) => ({
  type: ACTION_TYPES.ADD_CHOICE,
  value,
  label,
  id,
  groupId,
  disabled,
  elementId,
  customProperties,
  placeholder,
  keyCode,
});

/**
 * @argument {Choice[]} results
 * @returns {Action & { results: Choice[] }}
 */
export const filterChoices = results => ({
  type: ACTION_TYPES.FILTER_CHOICES,
  results,
});

/**
 * @argument {boolean} active
 * @returns {Action & { active: boolean }}
 */
export const activateChoices = (active = true) => ({
  type: ACTION_TYPES.ACTIVATE_CHOICES,
  active,
});

/**
 * @returns {Action}
 */
export const clearChoices = () => ({
  type: ACTION_TYPES.CLEAR_CHOICES,
});
