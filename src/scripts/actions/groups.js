import { ACTION_TYPES } from '../constants';

export const addGroup = (value, id, active, disabled) => ({
  type: ACTION_TYPES.ADD_GROUP,
  value,
  id,
  active,
  disabled,
});
