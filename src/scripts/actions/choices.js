import { ACTION_TYPES } from '../constants';

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

export const filterChoices = results => ({
  type: ACTION_TYPES.FILTER_CHOICES,
  results,
});

export const activateChoices = (active = true) => ({
  type: ACTION_TYPES.ACTIVATE_CHOICES,
  active,
});

export const clearChoices = () => ({
  type: ACTION_TYPES.CLEAR_CHOICES,
});
