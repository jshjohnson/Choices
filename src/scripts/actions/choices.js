/**
 * @typedef {import('../../../types/index').Choices.Choice} Choice
 */

import { ACTION_TYPES } from '../constants';

/**
 * @argument {Choice} choice
 * @returns {{ type: string } & Choice}
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
 * @returns {{ type: string, results: Choice[] }}
 */
export const filterChoices = results => ({
  type: ACTION_TYPES.FILTER_CHOICES,
  results,
});

/**
 * @argument {boolean} active
 * @returns {{ type: string, active: boolean }}
 */
export const activateChoices = (active = true) => ({
  type: ACTION_TYPES.ACTIVATE_CHOICES,
  active,
});

/**
 * @returns {{ type: string }}
 */
export const clearChoices = () => ({
  type: ACTION_TYPES.CLEAR_CHOICES,
});
