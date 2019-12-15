import { ACTION_TYPES } from '../constants';

export interface AddGroupAction {
  type: typeof ACTION_TYPES.ADD_GROUP;
  id: number;
  value: string;
  active: boolean;
  disabled: boolean;
}

export const addGroup = ({
  value,
  id,
  active,
  disabled,
}: {
  id: number;
  value: string;
  active: boolean;
  disabled: boolean;
}): AddGroupAction => ({
  type: ACTION_TYPES.ADD_GROUP,
  value,
  id,
  active,
  disabled,
});
