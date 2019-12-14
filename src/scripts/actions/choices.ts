import { Action } from 'redux';
import { ACTION_TYPES } from '../constants';
import { Choice } from '../interfaces';

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
}): Action & Choice => ({
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

export const filterChoices = (
  results: Choice[],
): Action & { results: Choice[] } => ({
  type: ACTION_TYPES.FILTER_CHOICES,
  results,
});

export const activateChoices = (
  active = true,
): Action & { active: boolean } => ({
  type: ACTION_TYPES.ACTIVATE_CHOICES,
  active,
});

export const clearChoices = (): Action => ({
  type: ACTION_TYPES.CLEAR_CHOICES,
});
