import { Group, State } from '../interfaces';
import { AddGroupAction } from '../actions/groups';
import { ClearChoicesAction } from '../actions/choices';

export const defaultState = [];

type ActionTypes = AddGroupAction | ClearChoicesAction;

export default function groups(
  state: Group[] = defaultState,
  action: ActionTypes,
): State['groups'] {
  switch (action.type) {
    case 'ADD_GROUP': {
      const addGroupAction = action as AddGroupAction;

      return [
        ...state,
        {
          id: addGroupAction.id,
          value: addGroupAction.value,
          active: addGroupAction.active,
          disabled: addGroupAction.disabled,
        },
      ];
    }

    case 'CLEAR_CHOICES': {
      return [];
    }

    default: {
      return state;
    }
  }
}
