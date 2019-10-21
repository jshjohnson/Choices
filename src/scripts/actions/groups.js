import { ACTION_TYPES } from '../constants';

/* eslint-disable import/prefer-default-export */
export const addGroup = (value, id, active, disabled) => ({
  type: ACTION_TYPES.ADD_GROUP,
  value,
  id,
  active,
  disabled,
});
