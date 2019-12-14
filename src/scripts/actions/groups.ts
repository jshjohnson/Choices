import { Action } from 'redux';
import { ACTION_TYPES } from '../constants';
import { Group } from '../interfaces';

export const addGroup = ({
  value,
  id,
  active,
  disabled,
}: Group): Action & Group => ({
  type: ACTION_TYPES.ADD_GROUP,
  value,
  id,
  active,
  disabled,
});
