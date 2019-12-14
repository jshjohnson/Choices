import { Action } from 'redux';
import { Group } from '../interfaces';

export const defaultState = [];

export default function groups(
  state: Group[] = defaultState,
  action: Action & Group,
): Group[] {
  switch (action.type) {
    case 'ADD_GROUP': {
      return [
        ...state,
        {
          id: action.id,
          value: action.value,
          active: action.active,
          disabled: action.disabled,
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
