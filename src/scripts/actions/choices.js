/**
 * @typedef {import('../../../types/index').Choices.Choice} Choice
 */

import { ACTION_TYPES } from '../constants';

/**
 * @argument {Choice} choice
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
 */
export const filterChoices = results => ({
  type: ACTION_TYPES.FILTER_CHOICES,
  results,
});

/**
 * @argument {boolean} active
 */
export const activateChoices = (active = true) => ({
  type: ACTION_TYPES.ACTIVATE_CHOICES,
  active,
});

export const clearChoices = () => ({
  type: ACTION_TYPES.CLEAR_CHOICES,
});
